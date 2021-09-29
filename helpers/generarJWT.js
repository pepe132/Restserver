
const jwt=require('jsonwebtoken');


const generarJWT=(uid='')=>{
    return new Promise((resolve,reject)=>{

        const payload={uid};
        jwt.sign(payload,process.env.SECRETORPRIVATEKEY,{//mandas el id, mandas tu token personalizado seguro, la duracion y la callback
            expiresIn:'4h',
        },(err,token)=>{
            if (err) {
                console.log(err);
                reject('No se pudo generar el token')   
            }else{
                resolve(token);
            }
        })

    })

}
module.exports={
    generarJWT
}