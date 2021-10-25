const { response } = require("express");
const {ObjectId}=require('mongoose').Types;
const Usuario=require('../models/usuario')
const Categoria=require('../models/categoria')
const Producto=require('../models/producto')

const coleccionesPermitidas=[
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios=async(termino='',res=response)=>{

    const esMongoId=ObjectId.isValid(termino);//si es un id de mongo va a regresar un true

    if (esMongoId) {
        const usuario=await Usuario.findById(termino);
        return res.json({
            results:(usuario) ? [usuario] : []
        })
        
    }

    const regex=new RegExp(termino,'i');//que el termino de busqueda sea insensible a las minusculas y mayusculas

    const usuarios=await Usuario.find({
        $or:[{nombre:regex},{correo:regex}],//el nombre coincida con esa expresion regular o va a cumplir con esta otra condicion
        $and:[{estado:true}]//y tambien tiene que cumplir una de estas condiciones, esta es a fuerza
    });


    res.json({
        results: usuarios
    })

}

const buscarCategorias=async(termino='',res=response)=>{

    const esMongoId=ObjectId.isValid(termino);//si es un id de mongo va a regresar un true

    if (esMongoId) {
        const categoria=await Categoria.findById(termino);
        return res.json({
            results:(categoria) ? [categoria] : []
        })
        
    }

    const regex=new RegExp(termino,'i');//que el termino de busqueda sea insensible a las minusculas y mayusculas

    const categorias=await Categoria.find({nombre:regex,estado:true});


    res.json({
        results: categorias
    })

}

const buscarProductos=async(termino='',res=response)=>{

    const esMongoId=ObjectId.isValid(termino);//si es un id de mongo va a regresar un true

    if (esMongoId) {
        const producto=await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results:(producto) ? [producto] : []
        })
        
    }

    const regex=new RegExp(termino,'i');//que el termino de busqueda sea insensible a las minusculas y mayusculas

    const productos=await Producto.find({nombre:regex,estado:true}).populate('categoria','nombre');


    res.json({
        results: productos
    })

}


const buscar=(req,res=response)=>{
    const {coleccion,termino}=req.params

    if (!coleccionesPermitidas.includes(coleccion)){//si la coleccion de busqueda no esta en el arreglo de colecciones permitidas
        return res.status(400).json({
            msg:`las colecciones permitidas son: ${coleccionesPermitidas}`
        })
        
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res)
            
            break;
        case 'categorias':
            buscarCategorias(termino,res)
            break;
        case 'productos':
            buscarProductos(termino,res)

            break;
    
        default:
            res.status(500).json({
                msg:'Se me olvidó hacer esta busqueda'
            });
    }
    
}

module.exports={
    buscar
}