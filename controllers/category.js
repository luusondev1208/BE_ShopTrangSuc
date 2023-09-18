const Category = require('../models/category')
const asyncHandler = require('express-async-handler')


const getAllCategory = asyncHandler(async(req,res)=>{
    const response = await Category.find().select('title _id')
    return res.json({
        success : response ? 'Hiển thị category thành công' : false,
        getAllCategory : response ? response : 'Ko hiển thị category được!!'
    })
})



const deleteCategory = asyncHandler(async(req,res)=>{
    const {pcid} = req.params
    const response = await Category.findByIdAndDelete(pcid)
    return res.json({
        success : response ? 'Xóa Category thành công' : false,
        deleteCategory : response ? response : 'Ko xóa category được!!'
    })
})

module.exports = {

    getAllCategory,

    deleteCategory

}
