const {Schema,model}=require('mongoose');

const usuarioSchema=Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio']
    },
    correo:{
        type:String,
        required:[true,'El correo es obligatorio'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligatoria'],
    },
    img:{
        type:String,
    },
    rol:{
        type:String,
        required:true,
        emun:['ADMIN_ROLE','USER_ROLE']
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }

});

//este metodo es para sacar propiedades de la peticion
usuarioSchema.methods.toJSON=function (){
    const {__v,password,_id,...usuario}=this.toObject();//esto me va a generar mi instancia con sus valores respectivos(nombre,correo contraseña)
    //el operador spread con el usuario es que las demas columnas se almacenan en la variable usuario
    usuario.uid=_id;
    return usuario;
    
}
module.exports=model('Usuario',usuarioSchema);//se manda el esquema en singular