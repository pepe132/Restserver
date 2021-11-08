const path=require('path');//crear urls

const { v4: uuidv4 } = require('uuid');

const subirArchivo=(files,extensionesValidas=['png','jpg','jpeg','gif'],carpeta='')=>{

    return new Promise((resolve,reject)=>{

        const {archivo} = files;//aqui establece lo que viene en la request.files y busca una propiedad llamada archivo

        const nombreCortado=archivo.name.split('.');//split corta el string y el punto me permitira separar el arreglo
        const extension=nombreCortado[nombreCortado.length-1]//sacar la extension del archivo

        //validar la extension del archivo

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es valida, ${extensionesValidas}`)
           
            
        }
        const nombreTemp=uuidv4() + '.'  + extension; // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

        const uploadPath = path.join( __dirname, '../uploads/',carpeta,nombreTemp);//ruta a la que quiero subir ese rachivo

        archivo.mv(uploadPath, (err)=> {
            if (err) {
                reject(err)
            }

            resolve(nombreTemp)
        });

    });
    

}

module.exports={
    subirArchivo
}