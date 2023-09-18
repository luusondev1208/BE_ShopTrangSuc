const router = require('express').Router()
const ctrls = require('../controllers/category')




router.get('/',  ctrls.getAllCategory)

router.delete('/:pcid',  ctrls.deleteCategory)



module.exports = router