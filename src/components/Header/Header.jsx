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
    <header className="py-3 px-4 shadow bg-rose-800 rounded-b-md text-white">
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
            className={`flex-col md:flex-row md:flex ml-auto items-center transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'flex' : 'hidden md:flex'
            }`}
          >
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name} className="mt-2 md:mt-0">
                  <button
                    onClick={() => {
                      navigate(item.slug);
                      setIsMenuOpen(false); // Close menu on navigation
                    }}
                    className="inline-block px-6 py-2 duration-200 hover:bg-rose-600 rounded-full"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className="mt-2 md:mt-0">
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
