
const {Schema,model}=require('mongoose');

const RoleSchema=Schema({//esquema de validacion de rol
    rol:{
        type:String,
        required:[true,'El rol es obligatorio']
    }

})
module.exports=model('Role',RoleSchema);