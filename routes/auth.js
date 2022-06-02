const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { signinValidator, signupValidator } = require('../validators/auth');

router.post('/signin', signinValidator, login);
router.post('/signup', signupValidator, createUser);

module.exports = router;
