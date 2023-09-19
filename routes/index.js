const {notFound,errHandler} = require('../middlewares/errHandler')


const userRouter = require('./user')
const categoryRouter = require('./category')

const productRouter = require('./product')



const initRoutes = (app) => {
    app.use('/api/user',userRouter)
    app.use('/api/category',categoryRouter),
    app.use('/api/product',productRouter)



    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes