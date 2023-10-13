const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')


// Thêm Blog
const createdBlog = asyncHandler(async(req,res)=>{
    const { title, description,category} = req.body
    if(!title || !description || !category) throw new Error("Ko được bỏ trống!")
    const response = await Blog.create(req.body)
    return res.json({
        success : response ? 'Thêm Blog thành công' : false,
        createdBlog : response ? response : 'Ko thêm Blog được!!'
    })
})


// Hiển thị Blogs
const getBlogs = asyncHandler(async(req,res)=>{
    const response = await Blog.find()
    return res.json({
        success : response ? 'Hiển thị Blog thành công' : false,
        getBlog : response ? response : 'Ko thêm Blog được!!'
    })
})

//Hiển thị Blog
const getBlog = asyncHandler(async(req,res)=>{
    const {bid} = req.params
    const blog = await Blog.findByIdAndUpdate(bid,{ $inc:{numberViews:1}},{new:true})
    .populate('likes','firstname lastname').populate('dislikes','firstname lastname')
    return res.json({
        success : blog ? 'Hiển thị bài viết thành công' : false,
        rs : blog 
    })
})
//Cập nhập Blog
const updateBlog = asyncHandler(async(req,res)=>{
    const { bid} = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Ko được bỏ trống!')
    const response = await Blog.findByIdAndUpdate(bid,req.body,{new:true})
    return res.json({
        success : response ? 'Cập nhập Blog thành công' : false,
        updateBlog : response ? response : 'Ko thêm Blog được!!'
    })
})


//Xóa Blog
const deleteBlog = asyncHandler(async(req,res)=>{
    const {bid} = req.params
    const response = await Blog.findByIdAndDelete(bid)
    return res.json({
        success : response ? 'Xóa Blog thành công' : false,
        deleteBlog : response ? response : 'Ko xóa Blog được!!'
    })
})



// Thêm ảnh Blog
const uploadImageBlog = asyncHandler(async(req,res)=>{
    const {bid} = req.params
    if(!req.file)  throw new Error('Ko được bỏ trống')
    const response = await Blog.findByIdAndUpdate(bid,{$push: {images: req.file.path}}, {new:true})

    return res.status(200).json({
        status:response ? 'Thêm ảnh thành công' : false,
        updateBlog : response ? response : 'Ko thêm được ảnh vào Blog'
    })})

module.exports = {
    createdBlog,
    updateBlog,
    getBlogs,
    deleteBlog,
    getBlog,
    uploadImageBlog
   
}

