const { response } = require("express");
const Producto=require('../models/producto')

const crearProducto= async(req,res=response)=>{
    const {estado,usuario, ...body}=req.body
    const productoDB=await Producto.findOne({nombre:body.nombre});

    if (productoDB){//evitamos crear dos iguales, ya que ya existe
        res.status(400).json({
            msg:`El producto ${productoDB.nombre} ya existe `
        })
        
    }

    //Generar la data a grabar
    const data={
        ...body,//grabamos todo lo demas(descripcion, precio, etc)
        nombre:body.nombre.toUpperCase(),//voy a poner el nombre capitalizado
        usuario:req.usuario._id//mostrar en el usuario el _id de omngo
    }

    const producto=new Producto(data);//crea la categoria usando el modelo, la prepara pero aun no la guarda en base de datos

    //Guardar DB

     await producto.save();

     res.status(201).json(producto)

}

const obtenerProductos=async(req,res=response)=>{
    const {limite=5,desde=0}=req.query//argumentos que vienen por el query
    
    const [total,productos]= await Promise.all([//mandar un arreglo con todas las promesas que quiero que se ejecuten
        //total se aplica para la primer promesa, usuarios para la segunda 
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true})
        .populate('usuario','nombre')//añadir informacion en este caso necesaria de otro tipo, necesitamos el usuario
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        productos

    });
}

const obtenerProducto=async(req,res=response)=>{
    const {id}=req.params;//obtengo el id
    const producto=await Producto.findById(id)
                            .populate('usuario','nombre')
                            .populate('categoria','nombre')

    res.json(producto)

}

const actualizarProducto=async(req, res=response)=> {
    const {id}=req.params;
    const {estado,usuario, ...data}=req.body;

    if (data.nombre){//si viene el nombre del productp
        
        data.nombre=data.nombre.toUpperCase()//cambiamos el nombre de la categoria a mayuscula
    }

    data.usuario=req.usuario._id//tenemos el id del usuario dueño del token

    const producto=await Producto.findByIdAndUpdate(id,data,{new:true});//buscalo por el id y actualizalo, ademas manda el documento actualizado(en la respuesta)

    res.json(producto);//devuelve en formato json el registro
}

const eliminarProducto=async(req,res=response)=>{
    const {id}=req.params;//que venga un id que existe en la base de datos
    
    const producto=await Producto.findByIdAndUpdate(id,{estado:false},{new:true});
    res.json(producto);
}

module.exports={
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto
}
