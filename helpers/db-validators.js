const categoria = require("../models/categoria");
const producto = require("../models/producto");
const role = require("../models/role");
const Usuario=require('../models/usuario');

const esRoleValido=async(rol='')=>{
    const existeRol=await role.findOne({rol});//buscar un rol que sea igual al que estoy intentando validar
    if (!existeRol){
        throw new Error(`El rol ${rol} no esta resgistrado en la base de datos`)  //asi tengo que manra un error personalizado para el custom
    }
}

const emailExiste=async(correo='')=>{
    const existeEmail=await Usuario.findOne({correo});
    if (existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado`)
    }
}

const existeUsuarioPorId=async(id)=>{
    const existeUsuario=await Usuario.findById(id);
    if (!existeUsuario){
        throw new Error(`El ID no existe  ${id}`)
    }
}

//Validadores personalizados de categorias

const existeCategoriaPorId=async(id)=>{
    const existeCategoria=await categoria.findById(id);
    if (!existeCategoria){
        throw new Error(`El ID no existe  ${id}`)
    }
}

//Validadores personalizados de productos

const existeProductoPorId=async(id)=>{
    const existeProducto=await producto.findById(id);
    if (!existeProducto){
        throw new Error(`El ID no existe  ${id}`)
    }
}



module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}