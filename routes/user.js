

const {Router}=require('express');
const { check } = require('express-validator');
const { usuarios_get, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/user');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const router=Router();

router.get('/',usuarios_get);

router.put('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido),
    validarCampos
],usuariosPut);

//check es un middleware en el cual yo le puedo especificar que campo del body necesito revisar 
router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),//validacion de nombre, decimos que no este vacio
    check('password','El password debe de ser mas de 6 letras').isLength({min:6}),
    check('correo','El correo no es valido').isEmail(),//con el express validator podemos crear nuestras validaciones 
    check('correo').custom(emailExiste),//custom significa verificacion personalizada
    check('rol').custom( esRoleValido),
    validarCampos//se pone hasta el ultimo ya que quiero revisar todos los errores de cada uno de los checks, si esta middleware pasa...
],usuariosPost);//entonces ejecuto este controlador

router.delete('/:id',[//middlawres a ejecutar
    validarJWT,
    //esAdminRole, Fuerza a que el usuario tenga que ser administrador
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),//puede ser admin o ventas
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports=router;