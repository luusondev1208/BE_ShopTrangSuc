


const categoryRouter = require('./category')

const productRouter = require('./product')



const initRoutes = (app) => {

    app.use('/api/category',categoryRouter),
    app.use('/api/product',productRouter)




}

module.exports = initRoutes