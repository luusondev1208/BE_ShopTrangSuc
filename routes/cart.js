
const express = require('express');
const cartController = require('../controllers/cart');

const router = express.Router();


router.get('/getCartUser/:id', cartController.getCartByUser);
router.post('/addToCart', cartController.addToCart);
router.put('/update', cartController.updateCart);
router.delete('/removeAll/:id', cartController.clearCart);
router.delete('/remove/:id', cartController.removeProduct);
module.exports = router;
