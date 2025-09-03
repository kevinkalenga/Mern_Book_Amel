import asyncHandler from "../middleware/asyncHandler.js";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";
import validator from 'validator'

// sign in user
const authUser = asyncHandler(async(req, res) => {
    // les donnés de l'utilisateur(email et mdp)
    const {email, password} = req.body;
    //  on recup l'utilisateur à partir de son email
    const user = await User.findOne({email})
    // si le user est recup et on compare le mdp
    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id)

        res.json({
            _id: user._id,
            name: user.name,
            email:user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("Email ou Mot de passe invalide")
    }
})

// sign up user
const registerUser = asyncHandler(async(req, res) => {
      const {name, email, password} = req.body;

      if(!validator.isStrongPassword(password, {
           minLength: 8,
           minLowercase: 1,
           minUppercase:1,
           minNumbers: 1,
           minSymbols:1
      })) {
        res.status(400)
        throw new Error("Le mot de passe doit contenir au moins 8 caractères, un miniscule, un majiscule, un nombre et un symbole")
      }

      const userExist = await User.findOne({email})

      if(userExist) {
         res.status(404)
        throw new Error("L'utilisateur est deja inscrit")
      }
      const user = await User.create({
        name,
        email,
        password
      })

      if(user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
      } else {
         res.status(404)
        throw new Error("L'utilisateur n'existe pas")
      }
})

// logout user 

const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message: "Déconnexion reussi"})
})

// get user profile (private)

const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        res.status(200).json({
            _id: user._id,
            name:user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("L'utilisateur non trouvé")
    }
})

// update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if(req.body.email && !validator.isEmail(req.body.email)) {
           res.status(400)
           throw new Error("Email invalid")
        }
        if(req.body.password && !validator.isStrongPassword(req.body.password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
             res.status(400);
             throw new Error("Le mot de passe doit contenir au moins 8 caractères, un miniscule, un majiscule, un nombre et un symbole")
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updateUser = await user.save();

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("user not found")
    }
})

// get all users (private admin)
const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
})

// delete user (private admin)

const deleteUser = asyncHandler(async(req, res) => {
     const user = await User.findById(req.params.id);

     if(!user) {
       res.status(400)
       throw new Error("L'utilisateur non trouvé")
        
     }

     if(user.isAdmin) {
          res.status(400)
          throw new Error("Vous ne pouvez pas supprimer le compte admin")
     }

     await User.deleteOne({_id: user._id})
     res.status(200).json({message: "L'utilisateur supprimé"})
})

// get user by id (private admin)
const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if(user) {
        res.status(200).json(user)
    } else {
      res.status(400)
       throw new Error("L'utilisateur non trouvé")
    }
})

// update user (private admin)
const updateUser = asyncHandler(async(req, res) => {
     const user = await User.findById(req.params.id)

    if(!user) {
       res.status(400)
       throw new Error("L'utilisateur non trouvé")
        
    }

    if(req.body.email && !validator.isEmail(req.body.email)) {
        res.status(400)
        throw new Error("L'adresse email invalide")
    }

    // empecher le modif de role admin
    if(user.isAdmin && req.body.isAdmin === false) {
        res.status(400)
        throw new Error("Vous ne pouvez pas changer le role admin")
    }

    // Mise à jour des champs
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;

    // Mise à jour de isAdmin seulement si fourni (si authorisé)
    if(typeof req.body.isAdmin !== 'undefined') {
        user.isAdmin = Boolean(req.body.isAdmin)
    }

    const updatedUser = await user.save()

    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin

    })
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}