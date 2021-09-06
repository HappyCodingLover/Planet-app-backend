import Router from 'express-promise-router'
import {
  listings, addProduct, myListings, userListingsCount, favListings
} from '~/packages/api/resources/products/controller'

const router = Router()

router.route('/listings').post(listings)
router.route('/favlistings').post(favListings)
router.route('/userlistings').post(myListings)
router.route('/addlistings').post(addProduct)
router.route('/userListingsCount').post(userListingsCount)

export default router
