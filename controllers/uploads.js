const { response } = require("express");
const path=require('path')
const fs=require('fs')
const  cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const { subirArchivo } = require("../helpers/subir-archivo");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");
const cargarArchivo=async(req,res=response)=>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {//si no viene la propiedad files en la request
        res.status(400).json({msg:'No hay archivos que subir'});
        return;
    }
    try {
        //const nombre=await subirArchivo(req.files,['txt','md'],'textos')-subir archivos con dichas extensiones y en la carpeta textos
        const nombre=await subirArchivo(req.files,undefined,'imgs')
        res.json({
            nombre
        })
        
    } catch (msg) {
        res.status(400).json({msg})
        
    }

}

/*const actualizarImagen=async(req,res=response)=>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {//si no viene la propiedad files en la request
        res.status(400).json({msg:'No hay archivos que subir'});
        return;
    }


    const {coleccion,id}=req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id)
            if(!modelo){//si el modelo de usuario no existe 
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                });


            }
            break;

            case 'productos':
                modelo=await Producto.findById(id)
                if(!modelo){//si el modelo de usuario no existe 
                    return res.status(400).json({
                        msg:`No existe un producto con el id ${id}`
                    });
                    
                }
                break;
        default:
            return res.status(500).json({
                msg:'se me olvido validar esto'
            })    
    }

    //Limpiar imagenes previas
    if (modelo.img){
        //hay que borrar la imagen del servidor
        const path_imagen=path.join(__dirname,'../uploads',coleccion,modelo.img)
        if (fs.existsSync(path_imagen)){
            fs.unlinkSync(path_imagen)
            
        }
    }

    const nombre=await subirArchivo(req.files,undefined,coleccion)//subirarchivo(origen imagenes-extension de imagenes-carpeta en donde se van a almacenar)
    modelo.img=nombre;
    await modelo.save();
    res.json(modelo);


}*///esta era para guardar las imagenes solo en la carpeta local

const actualizarImagenCloudinary=async(req,res=response)=>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {//si no viene la propiedad files en la request
        res.status(400).json({msg:'No hay archivos que subir'});
        return;
    }


    const {coleccion,id}=req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id)
            if(!modelo){//si el modelo de usuario no existe 
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                });


            }
            break;

            case 'productos':
                modelo=await Producto.findById(id)
                if(!modelo){//si el modelo de usuario no existe 
                    return res.status(400).json({
                        msg:`No existe un producto con el id ${id}`
                    });
                    
                }
                break;
        default:
            return res.status(500).json({
                msg:'se me olvido validar esto'
            })    
    }

    //Limpiar imagenes previas de cloudinary
    if (modelo.img){
        const nombreArr=modelo.img.split('/')//dividir cada elemento del url por una diagonal
        const nombre=nombreArr[nombreArr.length-1]//el nombre de la imagen en el security_url de cludinary
        const [public_id]=nombre.split('.');//obtendre el id publico de la imagen(split genera un arreglo)
        cloudinary.uploader.destroy(public_id)

        
    }

    const {tempFilePath}=req.files.archivo
    const {secure_url}=await cloudinary.uploader.upload(tempFilePath)
    modelo.img=secure_url;//le voy a establecer la imagen al modelo mediante su secure_url
    await modelo.save();
    res.json(modelo);//retorno el modelo


}

const mostrarImagen=async(req,res=response)=>{

    const {coleccion,id}=req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id)
            if(!modelo){//si el modelo de usuario no existe 
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                });


            }
            break;

            case 'productos':
                modelo=await Producto.findById(id)
                if(!modelo){//si el modelo de usuario no existe 
                    return res.status(400).json({
                        msg:`No existe un producto con el id ${id}`
                    });
                    
                }
                break;
        default:
            return res.status(500).json({
                msg:'se me olvido validar esto'
            })    
    }

    //Limpiar imagenes previas
    if (modelo.img){
        //hay que borrar la imagen del servidor
        const path_imagen=path.join(__dirname,'../uploads',coleccion,modelo.img)
        if (fs.existsSync(path_imagen)){
            return res.sendFile(path_imagen)
        }
    }

    const pathImagen=path.join(__dirname,'../assets/no-image.jpg');
    res.sendFile(pathImagen)

}

module.exports={
    cargarArchivo,
    actualizarImagenCloudinary,
    mostrarImagen
}

//si todo sale bien los archivos tienen que verse en la carpeta uploads