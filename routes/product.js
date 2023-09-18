const router = require('express').Router()
const ctrls = require('../controllers/product')


router.post('/', ctrls.createProduct)
router.get('/', ctrls.getProducts)
router.get('/:pid', ctrls.getProduct)
router.delete('/:pid', ctrls.deleteProduct)
router.put('/:pid', ctrls.updateProduct)


module.exports = router