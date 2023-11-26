const Order = require('../models/order')
const Cart = require('../models/cart')
const User = require('../models/user')
const Voucher = require('../models/coupon')
const config = require('config');
const moment = require('moment');
const querystring = require('qs');
const crypto = require("crypto");

const asyncHandler = require('express-async-handler')

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const createPaymentUrl = (req, res, next) => {

    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let config = require('config');

    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = config.get('vnp_ReturnUrl');
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    // let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    // if (bankCode !== null && bankCode !== '') {
    //     vnp_Params['vnp_BankCode'] = bankCode;
    // }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return res.status(200).json({
        message: "Truy cập đường dẫn",
        url: vnpUrl,
    });
}

const changeStatusPayment = async (req, res) => {
    const id = req.body.idOrder
    const data = await Order.findById(id)

    data.status = "Đang xử lý"
    await data.save();
    return res.status(200).json({
        message: "Thanh cong",
    });
}

const vnpayReturn = (req, res, next) => {
    // Nhận Tham số từ VNPay
    let vnp_Params = req.query;

    // Lấy và Xác Minh Chữ Ký An toàn
    let secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp Xếp và Chuẩn Bị Dữ liệu để Xác Minh Chữ Ký
    vnp_Params = sortObject(vnp_Params);

    // Lấy Cấu Hình và Khóa Bí mật
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');

    // Tạo và Xác Minh Chữ Ký
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    // Xử lý Kết Quả và Hiển Thị Trang Tương Ứng
    if (secureHash === signed) {
        res.redirect("http://localhost:4200/change-status")
    }
}

const createOrder = async (req, res) => {
    try {
        const user = await User.findById(req.body.user)
        const userCart = await Cart.findById(user.cart);

        if (!userCart) {
            return res.status(404).json({
                message: "Chưa có giỏ hàng",
            });
        }

        const orderStatus =
            req.body.paymentMethod === "VN Pay"
                ? "Chờ thanh toán"
                : "Đang xử lý";

        const cartProducts = userCart.products;
        const userId = user._id;
        const orderData = {
            ...req.body,
            products: cartProducts,
            user: userId,
            status: orderStatus,
        };

        const createdOrder = await Order.create(orderData);
        if (!createdOrder) {
            return res.status(404).json({
                message: "Tạo đơn hàng thất bại",
            });
        }

        if (req.body.vouchers && req.body.vouchers.length > 0) {
            const voucherIds = req.body.vouchers;

            const updateVoucher = async (voucherId) => {
                const voucher = await Voucher.findById(voucherId);
                if (!voucher) {
                    return res.status(404).json({
                        message: "Voucher không tồn tại",
                    });
                }

                voucher.limit -= 1;
                await voucher.save();
            };

            await Promise.all(voucherIds.map(updateVoucher));
        }

        const deletedCart = await Cart.findByIdAndRemove(user.cart);
        if (!deletedCart) {
            return res.status(404).json({
                message: "Không thể xóa giỏ hàng",
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            {
                $push: { orders: createdOrder._id, coupon: req.body.vouchers },
                cart: null,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "Người dùng không tồn tại",
            });
        }

        return res.status(201).json({
            message: "Tạo đơn hàng thành công",
            order: createdOrder,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra ",
        });
    }
}



const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Yeu cau trang thai')
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.json({
        success: response ? 'Thêm Order thành công' : false,
        response: response ? response : 'Ko thêm Order được!!'
    })
})



const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({ orderBy: _id })
    return res.json({
        success: response ? 'Thêm Order thành công' : false,
        response: response ? response : 'Ko thêm Order được!!'
    })
})



const getAllOrders = asyncHandler(async (req, res) => {
    const response = await Order.find()
    return res.json({
        success: response ? 'Hien thi Order thành công' : false,
        response: response ? response : 'Ko thêm Order được!!'
    })
})

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getAllOrders,
    createPaymentUrl,
    vnpayReturn,
    changeStatusPayment
}