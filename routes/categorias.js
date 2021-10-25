const {Router}=require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router=Router();

//obtener todas las categorias-publico(va a poder acceder cuqluiera a ver las categorias)
router.get('/',obtenerCategorias)

//obtener una categoria por id en particular-publico(va a poder acceder cualquiera a ver las categorias)
router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria)

//Crear categoria -privado(va a poder acceder cuqluiera persona pero que tenga un token valido )
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

//Actualizar una categoria-privado(va a poder actualizar cualquiera con token valido)
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],actualizarCategoria);

//Borrar una categoria-ADMIN
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),//que el id de categoria exista
    validarCampos
],eliminarCategoria)

module.exports=router;