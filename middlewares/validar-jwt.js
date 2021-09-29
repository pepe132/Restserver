
const { response, request } = require('express');
const jwt=require('jsonwebtoken');
const Usuario=require('../models/usuario');

const validarJWT= async(req=request,res=response,next)=>{//middleware que se dispara con tres argumentos
    const token=req.header('x-token');
    if (!token) {//si el usuario no pone el token
        return res.status(401).json({
            msg:'No hay token en la peticion'
        })
    }
    try {
        const {uid}= jwt.verify(token,process.env.SECRETORPRIVATEKEY);//verificar el json web token, sino es valido dispara el catch
        //leer el usuario que corresponde al uid
        const usuario=await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg:'Token no valido-usuario borrado DB'
            })
            
        }
        
        //verificar si el uid tiene estado en true
        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Token no valido-usuario con estado false'
            })
            
        }
        req.usuario=usuario;//almaceno en la request la informacion del usuario
        
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
        
    }
   
}
module.exports={
    validarJWT
}