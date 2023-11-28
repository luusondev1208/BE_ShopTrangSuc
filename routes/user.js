const router = require('express').Router()
const ctrls = require('../controllers/user')



const {verifyAccessToken,isAdmin} = require('../middlewares/verifyToken')
router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.get('/current/:uid', ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.get('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
router.delete('/', [verifyAccessToken, isAdmin], ctrls.deleteUser)
router.put('/current', [verifyAccessToken], ctrls.updateUser)
router.put('/address', [verifyAccessToken], ctrls.updateUserAddress)
router.put('/cart', [verifyAccessToken], ctrls.updateCart)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)
router.get('/wishlist', [verifyAccessToken], ctrls.getWishlist);
router.put('/current/password', [verifyAccessToken], ctrls.updatePassword)
router.post('/cart', verifyAccessToken, ctrls.addCart);
router.delete('/cart', verifyAccessToken, ctrls.deleteCart);



module.exports = router