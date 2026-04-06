import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa'
import { FaShoppingBag } from "react-icons/fa";

export default function Footer() {
  return (
    <div className='border border-t-4 border-b-2 rounded-lg sm:p-8 p-3 shadow-md border-b-slate-200 border-teal-600'>
      {/* Top Grid (About / Follow / Legal) */}
      <div className=" grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {/* ABOUT */}
        <div>
          <h1 className="font-semibold text-gray-600">ABOUT</h1>
          <ul className="text-sm text-slate-500">
            <a href='https://github.com/kashifali88' target="_blank" rel="noopener noreferrer"><li>JS Projects</li></a>
            <Link to='/about'><li>About us</li></Link>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div>
          <h1 className="font-semibold text-gray-600">FOLLOW US</h1>
          <ul className="text-sm text-slate-500">
            <a href='https://github.com/kashifali88' target="_blank" rel="noopener noreferrer"><li>Github</li></a>
            <Link to='/'><li>Discord</li></Link>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h1 className="font-semibold text-gray-600">LEGAL</h1>
          <ul className="text-sm text-slate-500">
            <Link to='/policy'><li>Privacy Policy</li></Link>
            <Link to='/'><li>Terms & Conditions</li></Link>
          </ul>
        </div>
        {/* CONTACT */}
        <div>
          <h1 className="font-semibold text-gray-600">CONTACT</h1>
          <ul className="text-sm text-slate-500">
            <Link to='/contact'><li>Contact us</li></Link>
          </ul>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 border-t border-slate-200 pt-4">
        {/* Left side */}
        <div className="flex items-center space-x-2">
          <Link to='/about' className='flex items-center gap-2'>
                  <FaShoppingBag className='text-xl' />
                <h1 className='font-semibold text-xl opacity-80 sm:text-2xl tracking-wide'>Hobb Springs</h1>
                </Link>
          <span className="text-sm text-slate-500">© 2026 Hobb Springs</span>
        </div>

        {/* Right side */}
        <ul className="flex gap-4 mt-4 sm:mt-0 text-slate-500 sm:text-xl">
          <Link to='/'><li><FaFacebook /></li></Link>
          <Link to='/'><li><FaInstagram /></li></Link>
          <a href='https://github.com/kashifali88' target="_blank" rel="noopener noreferrer"><li><FaGithub /></li></a>
          <Link to='/'><li><FaTwitter /></li></Link>
        </ul>
      </div>
    </div>
  )
}
