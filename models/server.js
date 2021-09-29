const express = require('express');
const cors=require('cors');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app=express();//crear el servidor 
        this.port=process.env.PORT;
        this.usuariosPath='/api/usuarios';//path de usuarios
        this.authPath='/api/auth';//path de autenticacion

        //CONECTAR A BASE DE DATOS
        this.conectarDB();

        /*MIDDLEWARES-son funciones que van a añadirle otra funcionalidad a mi webserver, es una funcion que se va a
        ejecutar cuando se levante nuestro servidor */
        this.middlewares();
        //RUTAS DE MI APLICACION
        this.routes();
    }
    async conectarDB(){
        await dbConnection();

    }
    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());//cualquier informacion que venga en post, put o delete la va a serializar a un formato json
        
        //Directorio publico
        this.app.use(express.static('public'));
    }
    routes(){//rutas de mi aplicacion, definiendolas
        this.app.use(this.authPath,require('../routes/auth'));
        this.app.use(this.usuariosPath,require('../routes/user'));
        

    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en el puerto',this.port);
        });
    }

}
module.exports=Server;