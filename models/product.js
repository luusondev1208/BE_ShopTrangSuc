const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    // 
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true // viết thường
    },
    description: {
        type: String,
        required: true,
    },
    //thương hiệu
    brand: {
        type: String,
        required: true
    },
    //Giá
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    //số lượng
    quantity: {
        type: Number,
        default: 0
    },
    // đã bán
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    // màu
    size: {
        type: String,
        enum: ['39', '40', '41', '42']
    },
    //Xếp hàng
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String }
        }
    ],
    //Tổng số xếp hạng
    totalRatings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);