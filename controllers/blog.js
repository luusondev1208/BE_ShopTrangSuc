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
    const response = await Blog.findByIdAndUpdate(bid,{ image: req.file.path}, {new:true})

    return res.status(200).json({
        status:response ? 'Thêm ảnh thành công' : false,
        updateBlog : response ? response : 'Ko thêm được ảnh vào Blog'
    })})



    
const likeBlog = asyncHandler (async(req,res)=>{
    const {_id} = req.user
    const {bid} = req.params
    if(!bid) throw new Error("Ko được bỏ trống!")
    const blog = await Blog.findById(bid)
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if(alreadyDisliked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull:{dislikes:_id}},{new:true})
        return res.json({
            success : response ? true : false,
            rs : response 
        })
    }

    const isLiked = blog?.likes?.find(el => el.toString() === _id)
    if (isLiked) {
         const response = await Blog.findByIdAndUpdate(bid, {$pull:{likes:_id}},{new:true})
         return res.json({
            success : response ? 'Like bài viết thành công' : false,
            rs : response 
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, {$push:{likes:_id}},{new:true})
        return res.json({
            success : response ? true : false,
            rs : response 
        })
    }
})


// DislikeBlog
const dislikeBlog = asyncHandler (async(req,res)=>{
    const {_id} = req.user
    const {bid} = req.params
    if(!bid) throw new Error("Ko được bỏ trống!")
    const blog = await Blog.findById(bid)
    const alreadyLiked = blog?.likes?.find(el => el.toString() === _id)
    if(alreadyLiked){
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } },{new:true})
        return res.json({
            success : response ? true : false,
            rs : response 
        })
    }

    const isDisliked = blog?.dislikes?.find(el => el.toString() === _id)
    if (isDisliked) {
         const response = await Blog.findByIdAndUpdate(bid, {$pull:{dislikes:_id}},{new:true})
         return res.json({
            success : response ? true : false,
            rs : response 
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, {$push:{dislikes:_id}},{new:true})
        return res.json({
            success : response ? true : false,
            rs : response 
        })
    }
})


module.exports = {
    createdBlog,
    updateBlog,
    getBlogs,
    deleteBlog,
    getBlog,
    uploadImageBlog,
    likeBlog,
    dislikeBlog,
   
}

