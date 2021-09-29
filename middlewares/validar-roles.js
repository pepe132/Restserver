const { response } = require("express")

const esAdminRole=(req,res=response,next)=>{
    if (!req.usuario) {//si regresa undefinde es que no hemos validado correctamente nuestra peticion
        return res.status(500).json({
            msg:'Se quiere verificar el rol sin validar el token primero'
        })
    }
    const {rol,nombre}=req.usuario;
    if (rol!=='ADMIN_ROLE'){
        return res.status(401).json({
            msg:`${nombre} no es administrador- No puede hacer esto `
        })
        
    }

    next();

}

const tieneRole=(...roles)=>{//espero recibir todos mis roles, los va a transformar con el operador rest en un arreglo[adminrole,ventasrole,etc]
    return (req,res=response,next)=>{//retorno una funcion que es la que se va a ejecutar en las rutas del usuario

        if (!req.usuario) {//si regresa undefinde es que no hemos validado correctamente nuestra peticion
            return res.status(500).json({
                msg:'Se quiere verificar el rol sin validar el token primero'
            })
        }
        if (!roles.includes(req.usuario.rol)) {//si entre los roles que etsoy recibiendo incluye el rol del usuario
            return res.status(401).json({
                msg:`El servicio require uno de estos roles ${roles}`
            })
            
        }
        
        next();

    }

}

module.exports={
    esAdminRole,
    tieneRole

}