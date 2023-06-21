/*
    Rutas de usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario,loginUsuario,revalidarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post(
    '/new',
    [ //middlewares
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe tener 6 caracteres').isLength({min: 6}),
        validarCampos
    ], 
    crearUsuario
)

router.post(
    '/',
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe tener 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    loginUsuario
)

//Como solo tengo un middlewere acá lo puedo pasar así, si fueran + debería pasarlo como un array
router.get('/renew', validarJWT ,revalidarToken)

module.exports = router;