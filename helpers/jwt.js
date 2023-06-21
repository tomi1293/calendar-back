const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    return new Promise((resolve,reject) => {

        const payload = {uid,name};

        //Para firmar el Token debemos pasarle el payload, una palabra clave y las options a la funcion sign
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn:'2h'
        }, (err, token) => {

            //Si hay algun error
            if( err ){
                console.log(err)
                reject('No se pudo generar el token');
            }
            //Si todo sale bien
            resolve( token );
        })
    })


}

module.exports = {
    generarJWT
}