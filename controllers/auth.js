
const { response } = require("express");
const Usuario=require('../models/usuario');
const bcryptjs=require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");
const { googleverify } = require("../helpers/google-verify");


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

//controlador para google

const google=async(req,res=response)=>{
    const {id_token}=req.body;//ya estamos recibiendo nuestro token en el lado del backend

    try {
        const {correo,nombre,img}=await googleverify(id_token);

        let usuario=await Usuario.findOne({correo});
        if (!usuario){
            //tengo que crearlo
            const data={
                nombre,
                correo,
                rol:'USER_ROLE',
                password:'hola',
                img,
                google:true

            };
            usuario=new Usuario(data);//la data de arriba es la que se la manda en caso de que no exista el usuario
            await usuario.save();//se guarda en base de datos     
        }
        //si el usuario en  BD
        if (!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador,usuario bloqueado'
            })
            
        }

        //generar el JWT
        const token=await generarJWT(usuario.id)//este es nuestro id de mongo

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'El token de Google no se pudo verificar'
        })
        
    }


}

module.exports={login,google}