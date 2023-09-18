const router = require('express').Router()
const ctrls = require('../controllers/product')


router.post('/', ctrls.createProduct)
router.get('/', ctrls.getProducts)
router.delete('/:pid', ctrls.deleteProduct)

router.get('/:pid', ctrls.getProduct)

module.exports = router