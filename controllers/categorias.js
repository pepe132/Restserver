const { response } = require("express");
const Categoria=require('../models/categoria')

const crearCategoria= async(req,res=response)=>{
    const nombre=req.body.nombre.toUpperCase();
    const categoriaDB=await Categoria.findOne({nombre});//vamos a consultar si ya existe un nombre de esa categoria, ver si no hay otra igual

    if (categoriaDB){//evitamos crear dos iguales, ya que ya existe
        res.status(400).json({
            msg:`la categoria ${categoriaDB.nombre} ya existe `
        })
        
    }

    //Generar la data a grabar
    const data={
        nombre,
        usuario:req.usuario._id//mostrar en el usuario el _id de omngo
    }

    const categoria=new Categoria(data);//crea la categoria usando el modelo, la prepara pero aun no la guarda en base de datos

    //Guardar DB

     await categoria.save();

     res.status(201).json(categoria)

}

const obtenerCategorias=async(req,res=response)=>{
    const {limite=5,desde=0}=req.query//argumentos que vienen por el query
    
    const [total,categorias]= await Promise.all([//mandar un arreglo con todas las promesas que quiero que se ejecuten
        //total se aplica para la primer promesa, usuarios para la segunda 
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true})
        .populate('usuario','nombre')//añadir informacion en este caso necesaria de otro tipo, necesitamos el usuario
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria=async(req,res=response)=>{
    const {id}=req.params;//obtengo el id
    const categoria=await Categoria.findById(id).populate('usuario','nombre');

    res.json(categoria)

}

const actualizarCategoria=async(req, res=response)=> {
    const {id}=req.params;
    const {estado,usuario, ...data}=req.body;

    data.nombre=data.nombre.toUpperCase()//cambiamos el nombre de la categoria a mayuscula
    data.usuario=req.usuario._id//tenemos el id del usuario dueño del token

    const categoria=await Categoria.findByIdAndUpdate(id,data,{new:true});//buscalo por el id y actualizalo, ademas manda el documento actualizado(en la respuesta)

    res.json(categoria);//devuelve en formato json el registro
}

const eliminarCategoria=async(req,res=response)=>{
    const {id}=req.params;//que venga un id que existe en la base de datos
    
    const categoria=await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});
    res.json(categoria);
}

module.exports={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
}