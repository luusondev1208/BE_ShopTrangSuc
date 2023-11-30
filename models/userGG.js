const mongoose = require('mongoose');

const userGGSchema = mongoose.Schema({
    
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: 'user',
    },
    cart: {
        type: mongoose.Types.ObjectId,
        ref: "Cart",
    },
    coupon: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Coupon",
        },
    ],
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: "Order",
    }],
    refreshToken: {
        type: String,
    },
});

module.exports = mongoose.model('userGG', userGGSchema);
