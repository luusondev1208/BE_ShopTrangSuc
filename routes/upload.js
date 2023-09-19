const router = require('express').Router()
const upload = require('../controllers/upload')

router.post('/', upload.fields([{name: "img", maxCount: 1}]), (req, res) =>{
    const link_img = req.files['img'][0];
    res.send(link_img)
})
module.exports = router