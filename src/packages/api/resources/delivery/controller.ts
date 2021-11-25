import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import * as path from 'path'
import { exec } from 'child_process'
import { Orders } from '~/packages/database/models/order'
import { getConnection } from 'typeorm'
import axios from 'axios'
import { parse } from 'fast-xml-parser'
import { Cities } from '~/packages/database/models/city'

const mondialWebServiceUrl = 'https://api.mondialrelay.com/Web_Services.asmx'
const enseigne = 'CC224ZXL'
const secretKey = 'N1mXUzVq'

export const mondialRelay = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { countryCode, postcode } = req.body
  let _postcode: string
  if (isNaN(postcode)) {
    const city = postcode
    const _city = await getConnection()
      .getRepository(Cities)
      .findOne({ where: { slug: city.toLowerCase() } })
    _postcode = _city.zip_code
  } else {
    _postcode = postcode
  }
  const phpFilePath = path.resolve(__dirname, '../../../../../mondial-relay-web-api/sample-parcelshop-search.php')
  exec(`php ${phpFilePath} ${countryCode} ${_postcode}`, (err, stdout, stderr) => {
    if (err) {
      console.error('err in mondial relay', err.message)
      return res.status(httpStatus.OK).send({ success: false, message: 'failed to call mondial relay' })
    } else if (stderr) {
      console.error('err in mondial relay', stderr)
      return res.status(httpStatus.OK).send({ success: false, message: 'failed to call mondial relay' })
    } else {
      // console.log(stdout)
      const xxx = stdout.substring(2)
      return res.status(httpStatus.OK).send({ success: true, message: 'success', data: JSON.parse(xxx) })
      // return res.status(httpStatus.OK).send({ success: true, message: 'success' })
    }
  })
}

export const createShipment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId, parcelShopId, merchant } = req.body
  const phpFilePath = path.resolve(__dirname, '../../../../../mondial-relay-web-api/sample-shipment-creation-v1.php')
  exec(
    `php ${phpFilePath} ${parcelShopId} ${merchant.address1} ${merchant.address2} ${merchant.address3} ${merchant.address4} ${merchant.city} ${merchant.countryCode}`,
    async (err, stdout, stderr) => {
      if (err) {
        console.error('err in mondial relay', err.message)
        return res.status(httpStatus.OK).send({ success: false, message: 'failed to call mondial relay' })
      } else if (stderr) {
        console.error('err in mondial relay', stderr)
        return res.status(httpStatus.OK).send({ success: false, message: 'failed to call mondial relay' })
      } else {
        // console.log(stdout)
        const xxx = stdout.substring(2)
        const data1 = JSON.parse(xxx)
        const data = {
          user_id: userId,
          status: 0,
          delivery_type: 0,
          shipmentNumber: data1.ShipmentNumber,
          tracking: data1.TrackingLink,
          labelLink: data1.LabelLink,
        }
        const result = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Orders)
          .values([data])
          .returning('id')
          .execute()
        return res.status(httpStatus.OK).send({ success: true, message: 'success', data: JSON.parse(xxx) })
        // return res.status(httpStatus.OK).send({ success: true, message: 'success' })
      }
    },
  )
}

export const searchMondialRelays = async (req: Request, res: Response): Promise<any> => {
  const { createHash } = await import('crypto')
  const { countryCode, postcode } = req.body
  const security = createHash('md5')
    .update(enseigne + countryCode + postcode + secretKey)
    .digest('hex')
  const data = `<?xml version="1.0" encoding="utf-8"?>\r\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <WSI2_RecherchePointRelaisAvancee xmlns="http://www.mondialrelay.fr/webservice/">\r\n      <Enseigne>${enseigne}</Enseigne>\r\n      <Pays>${countryCode}</Pays>\r\n      <Ville></Ville>\r\n      <CP>${postcode}</CP>\r\n      <Latitude></Latitude>\r\n      <Longitude></Longitude>\r\n      <Taille></Taille>\r\n      <Poids></Poids>\r\n      <Action></Action>\r\n      <DelaiEnvoi></DelaiEnvoi>\r\n      <RayonRecherche></RayonRecherche>\r\n      <TypeActivite></TypeActivite>\r\n      <NACE></NACE>\r\n      <Security>${security.toUpperCase()}</Security>\r\n    </WSI2_RecherchePointRelaisAvancee>\r\n  </soap:Body>\r\n</soap:Envelope>`
  const config = {
    headers: {
      SOAPAction: '"http://www.mondialrelay.fr/webservice/WSI2_RecherchePointRelaisAvancee"',
      'Content-Type': 'text/xml; charset=utf-8',
      Cookie: 'JSESSSIONID=658741433.1.776787680.2083203584',
    },
    data: data,
  }
  let response: any
  try {
    response = await axios.post(mondialWebServiceUrl, data, config)
  } catch (error) {
    console.error(error)
  }

  return res.status(httpStatus.OK).send({
    success: true,
    message: 'success',
    data: parse(response.data)['soap:Envelope']['soap:Body']?.WSI2_RecherchePointRelaisAvanceeResponse
      ?.WSI2_RecherchePointRelaisAvanceeResult?.ListePR?.ret_WSI2_sub_PointRelaisAvancee,
  })
}

export const detailPointRelays = async (req: Request, res: Response): Promise<any> => {
  const { createHash } = await import('crypto')
  const { countryCode, num } = req.body
  const security = createHash('md5')
    .update(enseigne + num + countryCode + secretKey)
    .digest('hex')
  const data = `<?xml version="1.0" encoding="utf-8"?>\r\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <WSI2_DetailPointRelais xmlns="http://www.mondialrelay.fr/webservice/">\r\n      <Enseigne>${enseigne}</Enseigne>\r\n      <Num>${num}</Num>\r\n      <Pays>${countryCode}</Pays>\r\n      <Security>${security.toUpperCase()}</Security>\r\n    </WSI2_DetailPointRelais>\r\n  </soap:Body>\r\n</soap:Envelope>`
  const config = {
    headers: {
      SOAPAction: '"http://www.mondialrelay.fr/webservice/WSI2_DetailPointRelais"',
      'Content-Type': 'text/xml; charset=utf-8',
      Cookie: 'JSESSSIONID=1707499163.1.873604832.2181401600',
    },
    data: data,
  }
  let response: any
  try {
    response = await axios.post(mondialWebServiceUrl, data, config)
  } catch (error) {
    console.error(error)
  }

  return res.status(httpStatus.OK).send({
    success: true,
    message: 'success',
    data: parse(response.data)['soap:Envelope']['soap:Body']?.WSI2_DetailPointRelaisResponse
      ?.WSI2_DetailPointRelaisResult,
  })
}
