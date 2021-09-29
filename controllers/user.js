const {response, request}=require('express');
const bcryptjs=require('bcryptjs');
const Usuario=require('../models/usuario');
const { validationResult } = require('express-validator');

const usuarios_get=async(req=request, res=response)=> {
    
    const {limite=5,desde=0}=req.query//argumentos que vienen por el query
    
    const [total,usuarios]= await Promise.all([//mandar un arreglo con todas las promesas que quiero que se ejecuten
        //total se aplica para la primer promesa, usuarios para la segunda 
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPut=async(req, res=response)=> {
    const {id}=req.params;
    const {_id,password,google,correo, ...resto}=req.body;

    //Validar contra base de datos
    if (password) {
        //encriptar la contraseña
        const salt=bcryptjs.genSaltSync();//hacer mas vueltas para la encriptacion
        resto.password=bcryptjs.hashSync(password,salt);
    }
    const usuarioDB=await Usuario.findByIdAndUpdate(id,resto);//buscalo por el id y actualizalo

    res.json(usuarioDB);//devuelve en formato json el registro
}

const usuariosPost=async(req, res=response)=> {

    //creacion de un usuario
    
    const {nombre,correo,password,rol}=req.body;
    const usuario=new Usuario({nombre,correo,password,rol});

    //encriptar la contraseña- requiere instalacion npm
    const salt=bcryptjs.genSaltSync();//hacer mas vueltas para la encriptacion
    usuario.password=bcryptjs.hashSync(password,salt);

    //guardar en DB
    await usuario.save();

    //se regresa el usuario grabado
    res.json({
        usuario
    });
}

const usuariosDelete=async(req, res=response)=> {
    const {id}=req.params;
    
    const usuario=await Usuario.findByIdAndUpdate(id,{estado:false});
    res.json(usuario);
}

module.exports={
    usuarios_get,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}