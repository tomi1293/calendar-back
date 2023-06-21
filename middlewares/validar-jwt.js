const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next ) => {

    // x-token headers
    const token = req.header('x-token');
    
    //Primera validacion verificamos si hay algun token, si hay uno sigue al trycatch
    if( !token ){
        res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    //El catch se dispara si la validacion del token falla
    try {
        
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = payload.uid;
        req.name = payload.name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'El token no es valido'
        }); 
    }

    next();
}

module.exports = { validarJWT }
