const Router = require('express');
const router = new Router();
const controller = require('./authController');
const validateToken = require('./validateToken');
const {check} = require('express-validator');

router.post('/auth/sign-up', [
    check('email', "Wrong format of email").isEmail(),
    check('password', 'Password must be longer than 4 and shorter than 30 symbols').isLength({min: 4, max: 30})
], controller.signUp);
router.post('/auth/sign-in', controller.signIn);
router.get('/me', validateToken, controller.getUser);

module.exports = router;