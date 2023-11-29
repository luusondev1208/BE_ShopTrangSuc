const express = require('express');
const passport = require('../config/passport');
const router = express.Router();
const ctrls = require('../controllers/google')
// router.get('/sign', passport.authenticate('google', { scope: ['profile'] }));

// router.get('/callback',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//         res.redirect('/');
//     }
// );
// router.get('/logout', ctrls.logout);

router.get("/sign-in", ctrls.googleOauth);

module.exports = router;