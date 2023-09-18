


const categoryRouter = require('./category')





const initRoutes = (app) => {

    app.use('/api/category',categoryRouter)





}

module.exports = initRoutes