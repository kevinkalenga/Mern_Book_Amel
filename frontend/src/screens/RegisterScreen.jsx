import { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import FormContainer from "../components/FormContainer";



function RegisterScreen() {
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [register, {isLoading}] = useRegisterMutation()
  const {userInfo} = useSelector((state) => state.auth) 

  // useLocation permet d avoir le path dans url   
  const {search} = useLocation();
  //  recherche de path
  const sp = new URLSearchParams(search)
  const redirect = sp.get("redirect") || "/" 

  useEffect(() => {
    if(userInfo) {
        navigate(redirect)
    }
  }, [navigate, redirect, userInfo])
  
   const submitHandler = async (e) => {
        e.preventDefault()
        if(password !== confirmPassword) {
            toast.error("Le mot de passe n'est pas identique")
        } else {
           try {
            const res = await register({name, email, password}).unwrap()
               dispatch(setCredentials({...res}))
               navigate(redirect)
           } catch (error) {
              toast.error(error?.data?.message || error.error)
           }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }
  
  return (
    <FormContainer>
       <h1 className="text-2xl font-semibold mb-4 mt-5">Inscription</h1>
       <form className="space-y-4" onSubmit={submitHandler}>
         <div className="space-y-2">
             <label className="block text-sm
              font-medium text-gray-700"
              htmlFor="name">Votre Nom</label>
              <input type="text" id="name"
               className="w-full px-3 py-2 border
                border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:right-2
                 focus:ring-primary" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                  placeholder="Votre Nom"
                 />

         </div>
         <div className="space-y-2">
             <label className="block text-sm
              font-medium text-gray-700"
              htmlFor="email">Votre Email</label>
              <input type="email" id="email"
               className="w-full px-3 py-2 border
                border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:right-2
                 focus:ring-primary" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre Email"
                 />

          </div>
         <div className="space-y-2 relative">
             <label className="block text-sm
              font-medium text-gray-700"
              htmlFor="password">Votre mot de passe</label>
              <input type={showPassword ? "text": "password"} id="password"
               className="w-full px-3 py-2 border
                border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:right-2
                 focus:ring-primary" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                 />

                 <button
                   onClick={togglePasswordVisibility}
                    type="button"
                    className="absolute inset-y-0 right-2 top-5 text-primary"
                    >
                    {
                        showPassword ? <FaEyeSlash /> : <FaEye />
                    }
                 </button>

         </div>
         <div className="space-y-2 relative">
             <label className="block text-sm
              font-medium text-gray-700"
              htmlFor="confirmPassword">Confirmation de mot de passe</label>
              <input type={showConfirmPassword ? "text": "password"} id="confirmPassword"
               className="w-full px-3 py-2 border
                border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:right-2
                 focus:ring-primary" 
                 
                 onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmation de mot de passe"
                 />

                 <button
                   onClick={toggleConfirmPasswordVisibility}
                    type="button"
                    className="absolute inset-y-0 right-2 top-5 text-primary"
                    >
                    {
                        showConfirmPassword ? <FaEyeSlash /> : <FaEye />
                    }
                 </button>

         </div>
         <button
           disabled={isLoading}
           type="submit"
           className="w-full bg-primary text-white
            px-2 py-2 rounded-md hover:bg-secondary
             focus:outline-none focus:ring-2 focus:ring-secondary"
         >
             Inscription
         </button>
         {
            isLoading && <Loader />
         }
       </form>
       <div className="py-3">
          <p> 
            Avez-vous deja un compte ?
            <Link 
             className="text-primary hover:text-secondary"
             to={redirect ? `/login?redirect=${redirect}`:'/login'}>
               Connectez-vous
            </Link>
         </p>
       </div>
    </FormContainer>
  )
}

export default RegisterScreen
