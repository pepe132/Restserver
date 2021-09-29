const { validationResult } = require("express-validator");

const validarCampos=(req,res,next)=>{
    const errors=validationResult(req);

    if (!errors.isEmpty()) {//si hay errores
        return res.status(400).json(errors);//muestro los errores que fueron creador por el express validator
    }
    next();//si el codigo pasa a este punto(si tiene exito ) sigue con el siguiente middleware
}
module.exports={
    validarCampos
}