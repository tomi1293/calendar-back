const { response } = require('express'); //Esto no vuelve a hacer la carga de express, Node solo lo carga una vez, pero acá lo utilizamos para no perder los autocompletado
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')

//* Para crear un usuario pasamos la información en el body como un JSON.
const crearUsuario = async(req,res = response ) => {

    const { email, password } = req.body;
    try {
        //El metodo findOne me devuelve null si no encuentra un usuario con ese email, en este caso significa que si me devuelve algo, ya existe un usario con ese email
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'Ya existe un usuario con ese email'
            });
        }

        //Creamos una nueva instancia a mi modelo usuario y le pasamos el req.body donde tenemos el name email y pass
        usuario = new Usuario(req.body)
        
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id,usuario.name)
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}
 
const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        //El metodo findOne me devuelve null si no encuentra un usuario con ese email, en este caso significa que si me devuelve algo, ya existe un usario con ese email
        const usuario = await Usuario.findOne({email});

        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg:'El usuario o contraseña no son correctos'
            });
        }
        
        //Confirmar los password, comparamos ambos password, el que recibo y el que está en la DB
        const validPassword = bcrypt.compareSync( password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok:false,
                msg:'Passsword incorrecto'
            })
        }

        //Si todo sale bien generamos nuestro JWT
        const token = await generarJWT(usuario.id,usuario.name)

        res.json({
            ok:true,
            uid: usuario.id,
            name:usuario.name,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}

const revalidarToken = async(req, res = response) => {

    const { uid, name } = req;

    //Generamos un nuevo token
    const token =  await generarJWT(uid,name);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}