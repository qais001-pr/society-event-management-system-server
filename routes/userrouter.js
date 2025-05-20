const express = require('express');
const router = express.Router();
const { getUser, getAllUsers, createUser, updateUser, deleteUser, loginUser, forgotpassword } = require('../controller/userController');
router.route('/')
    .get(getAllUsers)
    .post(createUser)
router.route('/:userid')
    .put(updateUser)
    .delete(deleteUser)
    .get(getUser)
router.route('/login')
    .post(loginUser)

router.route('/forgot-password')
    .post(forgotpassword)
module.exports = router;