const router = require('express').Router()
const ctrls = require('../controllers/order')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken], ctrls.createOrder)
router.put('/status/:oid', [verifyAccessToken, isAdmin], ctrls.updateStatus)
router.get('/', [verifyAccessToken], ctrls.getUserOrder)
router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getAllOrders)
router.post('/create_payment_url', ctrls.createPaymentUrl)
router.get('/vnpay_return', ctrls.vnpayReturn)
router.post('/changeStatusPayment', ctrls.changeStatusPayment)
module.exports = router 