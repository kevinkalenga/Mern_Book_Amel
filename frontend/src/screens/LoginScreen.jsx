import { useState, useEffect } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa6";



function LoginScreen() {
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPaswword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, {isLoading}] = useLoginMutation()
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
        try {
          const res = await login({email, password}).unwrap()
          dispatch(setCredentials({...res}))
          navigate(redirect)
        } catch (error) {
           toast.error(error?.data?.message || error.error)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPaswword)
    }
  
  return (
    <div>LoginScreen</div>
  )
}

export default Loader
