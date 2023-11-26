const {notFound,errHandler} = require('../middlewares/errHandler')


const userRouter = require('./user')
const categoryRouter = require('./category')
const orderRouter = require('./order')
const productRouter = require('./product')
const blogRouter = require('./blog')
const brandRouter = require('./brand')
const blogCategoryRouter = require('./blogCategory')
const couponRouter = require('./coupon')


const initRoutes = (app) => {
    app.use('/api/user',userRouter)
    app.use('/api/category',categoryRouter),
    app.use('/api/product',productRouter)
    app.use('/api/blog',blogRouter)
    app.use('/api/blogcategory',blogCategoryRouter)
    app.use('/api/brand',brandRouter)
    app.use('/api/order',orderRouter)
    app.use('/api/coupon',couponRouter)

    app.use(notFound)
    app.use(errHandler)

    app.get('/api/images', async (req, res) => {
        try {
          const images = await Image.find();
          res.json(images);
        } catch (error) {
          res.status(500).json({ error: 'lỗi k thấy ảnh' });
        }
      });
}

module.exports = initRoutes