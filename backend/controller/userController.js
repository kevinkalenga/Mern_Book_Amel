import asyncHandler from "../middleware/asyncHandler";
import User from "../model/userModel";
import generateToken from "../utils/generateToken";
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