import express from 'express';

const router = express.Router()

import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    updateUserProfile
} from '../controller/userController.js'

router.route('/').post(registerUser).get(getUsers)
router.post('/logout', logoutUser)
router.post('/auth', authUser)
router.route('/profile').get(getUserProfile).put(updateUserProfile)
router.route('/:id').delete(deleteUser).get(getUserById).put(updateUser)

export default router