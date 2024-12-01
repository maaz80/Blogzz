import React, { useEffect, useState } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiMenu, HiX } from 'react-icons/hi';
import Popup from '../Popup';
import authService from '../../appwrite/auth';
import ProfileImage from '../images/Unknown.jpg'

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const [isPopup, setIsPopup] = useState(false)
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('Unknown')
  const [initialLetters, setinitialLetters] = useState(null)

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true,
    }
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Finding User 
  const userData = () => {
    authService.getCurrentUser().then((userData) => {
      if (userData) {
        setUsername(userData.name)
        const Seperate = userData.name.split(' ')
        const initials = Seperate.map(name => name.charAt(0).toUpperCase()).join('')
        setinitialLetters(initials)
      }
    })

  }
  userData()

  return (
    <header className="py-2 w-full px-4 shadow bg-rose-800/20 md:bg-rose-800/20 rounded-b-md text-gray-600 z-50 ">
      <Container>
        <nav className="flex items-center justify-between">
          <div><Logo width={'w-14 md:w-20'} height={'h-8 md:h-12'} /></div>

          {authStatus && (
            <div className='flex items-center gap-2'>
              {/* User Name  */}
              <div className='  items-center gap-1 justify-center flex md:hidden'>
                <div className='text-white font-semibold '>{username}</div>
              </div>

              {/* Hamburger Icon for Mobile */}
              <button
                onClick={handleMenuToggle}
                className="text-gray-600 text-2xl md:hidden focus:outline-none"
              >
                {isMenuOpen ? <HiX color='white' /> : <HiMenu color='white' />}
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <ul
            className={`flex-col z-50 right-0 top-[50px] shadow-md shadow-gray-400 md:shadow-none text-rose-800 md:text-gray-600 rounded-md bg-white md:bg-transparent absolute md:static md:flex-row md:flex  items-center transition-all duration-1300 ease-in-out ${isMenuOpen ? 'flex ' : 'hidden md:flex'
              }`}
          >
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name} className="mt-0  ">
                  <button
                    onClick={() => {
                      navigate(item.slug);
                      setIsMenuOpen(false);
                    }}
                    className="inline-block w-[100%] md:w-32 px-6 py-2 duration-800 hover:bg-rose-200 md:hover:bg-rose-600/20 rounded-none md:rounded-full border-b md:border-none"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {/* Logout Button  */}
            {authStatus && (
              <li className="mt-0 w-full mr-0 md:mr-8">
                <LogoutBtn />
              </li>
            )}

            {/* User Name  */}
            {authStatus && (
              <div className='  items-center gap-3 justify-center hidden md:flex'>
                <div className='text-gray-600 font-semibold w-32'>{username}</div>
                <div className='bg-rose-300 w-8 h-8 rounded-full p-5 flex justify-center items-center text-gray-600'>{initialLetters}</div>
              </div>
            )}

          </ul>
        </nav>
        {isPopup && <Popup children={'Logout Succesfull!!!'} />}

      </Container>
    </header>
  );
}

export default Header;
