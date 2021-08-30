import Router from 'express-promise-router'
import {
  listings, addProduct, myListings, userListingsCount
} from '~/packages/api/resources/products/controller'

const router = Router()

router.route('/listings').post(listings)
router.route('/userlistings').post(myListings)
router.route('/addlistings').post(addProduct)
router.route('/userListingsCount').post(userListingsCount)

export default router
