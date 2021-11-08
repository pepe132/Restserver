const {Schema,model}=require('mongoose');

const ProductoSchema=Schema({//esquema de validacion de rol
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        default:true,
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,//tiene que ser tipo de otro objeto que vamos a traer de mongo
        ref:'Usuario',//este es mi esquema de donde va a venir la onformacion, el nombre tiene que estar como en su modelo a la hora de exportarlo, primer argumento
        required:true
    },
    precio:{
        type:Number,
        default:0
    },
    categoria:{//como usaremos la categoria tendremos que traer el esquema de categoria, aparte tiene que ser una categoria que exista
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true
    },
    descripcion:{type:String},
    disponible:{type:Boolean,default:true},
    img:{type:String},
});

ProductoSchema.methods.toJSON=function (){
    const {__v,estado, ...data}=this.toObject();//esto me va a generar mi instancia con sus valores respectivos(nombre,correo contraseña)
    //el operador spread con el usuario es que las demas columnas se almacenan en la variable usuario
    return data;
    
}
module.exports=model('Producto',ProductoSchema);