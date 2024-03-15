let router = require('express').Router()
let schema = require('../joi/schemaUser')
let validator = require('../middlewares/validator')
const {accountExists} = require('../middlewares/accountExistsSignUp')

let {registrar, verificar} = require('../controllers/user')


router.post('/signup', validator(schema), accountExists, registrar)
//router.post('/signup', validator(schema), accountExists(), registrar)
router.get('/verify/:code', verificar)

module.exports = router;
