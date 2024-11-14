import React, { useState } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiMenu, HiX } from 'react-icons/hi';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-3 px-4 shadow bg-rose-800 rounded-b-md text-white z-50">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="mr-4">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Hamburger Icon for Mobile */}
          <button 
            onClick={handleMenuToggle}
            className="text-white text-2xl md:hidden focus:outline-none"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>

          {/* Navigation Links */}
          <ul
            className={`flex-col z-50 right-0 top-[60px] shadow-md shadow-gray-400 md:shadow-none text-rose-800 md:text-white rounded-md bg-white md:bg-transparent absolute md:static md:flex-row md:flex  items-center transition-all duration-1300 ease-in-out ${
              isMenuOpen ? 'flex ' : 'hidden md:flex'
            }`}
          >
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name} className="mt-0  w-full ">
                  <button
                    onClick={() => {
                      navigate(item.slug);
                      setIsMenuOpen(false);
                    }}
                    className="inline-block w-[100%] md:w-32 px-6 py-2 duration-800 hover:bg-rose-200 md:hover:bg-rose-600 rounded-none md:rounded-full border-b md:border-none"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className="mt-0 w-full">
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
