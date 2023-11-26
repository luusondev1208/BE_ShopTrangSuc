const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: false
    },
    fromPrice: {
        type: Number,
        required: false
    },
    type: {
        type: String,
        required: true,
    },
    limit: {
        type: Number,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        default: "active",
    },
},
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);