
const {notFound,errHandler} = require('../middlewares/errHandler')

const categoryRouter = require('./category')





const initRoutes = (app) => {

    app.use('/api/category',categoryRouter)




    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes