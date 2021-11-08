const express = require('express');
const cors=require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server{
    constructor(){
        this.app=express();//crear el servidor 
        this.port=process.env.PORT;

        this.paths={
            auth:'/api/auth',
            buscar:'/api/buscar',
            categorias:'/api/categorias',
            usuarios:'/api/usuarios',
            productos:'/api/productos',
            uploads:'/api/uploads'

        }


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

        //fileupload- cargar archivos- aceptar archivos desde una peticon rest
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }
    routes(){//rutas de mi aplicacion, definiendolas
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.buscar,require('../routes/buscar'))
        this.app.use(this.paths.usuarios,require('../routes/user'));
        this.app.use(this.paths.categorias,require('../routes/categorias'));
        this.app.use(this.paths.productos,require('../routes/productos'))
        this.app.use(this.paths.uploads,require('../routes/uploads'))
        
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en el puerto',this.port);
        });
    }

}
module.exports=Server;