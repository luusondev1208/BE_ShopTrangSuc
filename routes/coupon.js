const router = require('express').Router()
const ctrls = require('../controllers/coupon')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')



router.post('/add', [verifyAccessToken, isAdmin], ctrls.createdCoupon)
router.post('/', ctrls.getCoupons)
router.get('/getCouponByDiscount', ctrls.getCouponByDiscount)
// router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon)



module.exports = router