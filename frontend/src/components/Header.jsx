import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {useNavigate, Link} from 'react-router-dom'
import { useLogoutMutation } from "../slices/usersApiSlice"
import { logout } from "../slices/authSlice"
import {FashoppingCart, FaUser, FaChevronDown, FaBars, FaSignOutAlt, FaTimes} from 'react-icons/fa'




function Header() {

      const {userInfo} = useSelector((state) => state.auth)
      const dispatch = useDispatch()
      const navigate = useNavigate()
      const [logoutApiCall] = useLogoutMutation()
      const [menuOpen, setMenuOpen] = useState(false)
      const [adminOpen, setAdminOpen] = useState(false)

      const logoutHandler = async () => {
         try {
            await logoutApiCall().unwrap();
            dispatch(logout())
             navigate('/login')
         } catch (error) {
            console.log(error)
         }
      }


      return(
        <header className="bg-primary text-white">
             <div className="container mx-auto flex items-center just-between p-4">
                 <Link to='/' className="flex items-center gap-2 text-lg font-bold">
                    <img src="/images/logo.png" alt="logo" className="h-8" />
                 </Link>
                 <div className="md:hidden">
                     <button onClick={() => setMenuOpen(!menuOpen)}>
                         {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                     </button>
                 </div>
                 <div className={`${menuOpen ? "block" : "hidden"}
                  md:flex md:items-center md:gap-4 absolute
                   md:relative top-16 md:top-0 w-full md:w-auto bg-primary md:bg-transparent z-50`}>
                    <Link to='/cart' className="relative flex items-center gap-2 p-2 md:p-0">
                        <FashoppingCart /> Panier
                    </Link>

                    {
                        userInfo ? (
                            <div className="relative">
                                 <Link to="/profile" className="flex items-center gap-1 p-2 md:p-0 focus:outline-none">
                                    <FaUser /> {userInfo.name}
                                 </Link>
                            </div>
                        ): (
                            <Link to='/login' className="flex items-center gap-1 p-2 md:p-0">
                               <FaUser /> Connexion
                            </Link>
                        )
                    }

                 </div>
             </div>
        </header>
      )



}

export default Header