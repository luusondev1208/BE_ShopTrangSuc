const router = require('express').Router()
const ctrls = require('../controllers/blog')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')


router.post('/', [verifyAccessToken, isAdmin], ctrls.createdBlog)
router.put('/update/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.get('/',  ctrls.getBlogs)
router.get('/one/:bid',  ctrls.getBlog)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)



module.exports = router 