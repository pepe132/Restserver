const {Router}=require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads');
const { coleccionesValidas } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router=Router();

router.post('/',cargarArchivo);

router.put('/:coleccion/:id',[
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesValidas(c,['usuarios','productos'])),//voy mandar la coleccion que esta recibiendo en el put(c), y las opciones que voy a permitir
    validarCampos
],actualizarImagenCloudinary)

router.get('/:coleccion/:id',[
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesValidas(c,['usuarios','productos'])),//voy mandar la coleccion que esta recibiendo en el put(c), y las opciones que voy a permitir
    validarCampos
],mostrarImagen)

module.exports=router;