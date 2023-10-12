const User = require('../models/user')
const asyncHandler = require('express-async-handler') // yarn add express-async-handler 
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken') 
const crypto = require('crypto')

// Đăng ký
const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    if (!email || !password || !lastname || !firstname)
        return res.status(400).json({
            sucess: false,
            mes: 'Ko được bỏ trống'
        })

    const user = await User.findOne({ email })
    if (user) throw new Error('Người dùng đã tồn tại')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            sucess: newUser ? true : false,
            mes: newUser ? 'Đăng ký thành công Vui lòng Đăng nhập!~' : 'Đã xảy ra lỗi'
        })
    }
})
// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, quân quyên người dùng
// Đăng Nhập
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            sucess: false,
            mes: 'Ko được bỏ trống'
        })
    // plain object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()
        // Tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // Tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        // Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            sucess: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Thông tin ko hợp lệ!')
    }
})
// GET ra 1 người dùng
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'Ko tìm thấy người dùng'
    })
})



// Hiển thị tài khoản người dùng
const getUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})

// Xóa tài khoản User
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deletedUser: response ? `Người dùng ${response.email} đã bị xóa` : 'Tài khoản ko tồn tại'
    })
})

// Cập nhập Người dùng
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})


// Cập nhập Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})

// Cập nhập địa chỉ User
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Ko duoc bo trong')
    const response = await User.findByIdAndUpdate(_id, { $push: {address: req.body.address }}, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const {pid , quantity, size} = req.body
    if (!pid || !quantity || !size) throw new Error('Ko được để trống !')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct) {
        if(alreadyProduct.size === size){
            const response = await User.updateOne({cart: { $elemMatch:alreadyProduct }}, { $set: {"cart.$.quantity":quantity}}, {new:true})
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Some thing went wrong'
            })
        }else{
            const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: pid, quantity, size}}}, { new: true })
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Some thing went wrong'
            })
        }
    } else {
        const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: pid, quantity, size}}}, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : 'Some thing went wrong'
        })
    }
   
})



module.exports = {
    register,
    login,
    getCurrent,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateCart,
    updateUserAddress,
    
}