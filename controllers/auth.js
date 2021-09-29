
const { response } = require("express");
const Usuario=require('../models/usuario');
const bcryptjs=require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");


const login= async(req,res=response)=> {

    const {correo,password}=req.body
    try {
        //verificar si el email existe

        const usuario=await Usuario.findOne({correo});
        if (!usuario){
            return res.status(400).json({
                msg:'Usuario/Password no son correctos'
            })
            
        }

        //si el usuario esta activo
        if (usuario.estado===false){
            return res.status(400).json({
                msg:'Usuario/Password no son correctos-estado:false'
            })
            
        }

        //verificar la contraseña
        const validPassword=bcryptjs.compareSync(password,usuario.password)
        //compare sync le puedes mandar el password que recibes como argumento en el body y compararlo a ver si es el mismo contra el que esta en la base de datos 
        if (!validPassword){
            return res.status(400).json({
                msg:'Usuario/Password no son correctos-password'
            }) 
        }

        //generar el JWT

        const token=await generarJWT(usuario.id)



        res.json({//voy a regresar
            usuario,//el usuario que se acaba de autenticar 
            token
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Hable con el administrador'
        })
        
    }
    
}

module.exports={login}