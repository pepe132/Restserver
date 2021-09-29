const mongoose=require('mongoose');

const dbConnection=async()=>{

    try {
        await mongoose.connect(process.env.MONGODB_CNN,{//url de los env
            useNewUrlParser:true,//
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        });
        console.log('base de datos exitosa');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos')
    }

}
module.exports={
    dbConnection
}