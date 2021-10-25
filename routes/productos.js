const {Router}=require('express');
const { check } = require('express-validator');
const {obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto}=require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');
const router=Router();

//obtener todas las productos-publico(va a poder acceder cuqluiera a ver las categorias)
router.get('/',obtenerProductos)

//obtener una categoria por id en particular-publico(va a poder acceder cualquiera a ver las categorias)
router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto)

//Crear categoria -privado(va a poder acceder cuqluiera persona pero que tenga un token valido )
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],crearProducto);

//Actualizar una categoria-privado(va a poder actualizar cualquiera con token valido)
router.put('/:id',[
    validarJWT,
    //check('categoria','No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProducto);

//Borrar una categoria-ADMIN
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),//que el id de categoria exista
    validarCampos
],eliminarProducto)

module.exports=router;