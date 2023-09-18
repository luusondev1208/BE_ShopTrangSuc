const router = require('express').Router()
const ctrls = require('../controllers/category')



router.post('/', ctrls.createdCategory)
router.get('/',  ctrls.getAllCategory)
router.put('/:pcid', ctrls.updateCategory)
router.delete('/:pcid',  ctrls.deleteCategory)



module.exports = router