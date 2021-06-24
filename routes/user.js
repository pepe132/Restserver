

const {Router}=require('express');
const { usuarios_get, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/user');
const router=Router();

router.get('/',usuarios_get);

router.put('/:id',usuariosPut);

router.post('/',usuariosPost);

router.delete('/', usuariosDelete);

module.exports=router;