import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../appwrite/auth';
import LogoutBtn from './Header/LogoutBtn';
import Logo from './Logo';
import { FaHome, FaPlus, FaSignInAlt, FaUserPlus, FaThLarge, FaList } from 'react-icons/fa';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 768);

    // Update sidebar state based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsExpanded(true); // Always expand on larger screens
            } else {
                setIsExpanded(false); // Allow toggle on smaller screens
            }
        };

        // Set initial state and add event listener
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const SideItem = [
        { name: 'Home', slug: '/', icon: <FaHome />, active: true },
        { name: 'All Posts', slug: '/all-posts', icon: <FaList />, active: authService },
        { name: 'Add Post', slug: '/add-post', icon: <FaPlus />, active: authService },
        { name: 'Login', slug: '/login', icon: <FaSignInAlt />, active: !authService },
        { name: 'SignUp', slug: '/signup', icon: <FaUserPlus />, active: !authService },
        { name: 'Dashboard', slug: '/dashboard', icon: <FaThLarge />, active: authService },
    ];

    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setIsExpanded(!isExpanded); // Allow toggling only on small screens
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 h-screen ${
                isExpanded ? 'w-60' : 'w-12'
            } bg-rose-700 transition-all duration-300 rounded-r-3xl flex flex-col items-center z-40`}
        >
            {/* Logo Section */}
            <div className={`p-5 ${isExpanded ? 'block' : 'hidden md:block'} w-full`}>
                <Logo textColor="text-white mb-10" />
            </div>

            {/* Sidebar Items */}
            <ul className={`flex-1 space-y-4 w-full ${isExpanded? 'mt-0' : 'mt-24'} `}>
                {SideItem.map(
                    (item) =>
                        item.active && (
                            <li
                                key={item.name}
                                onClick={() => navigate(item.slug)}
                                className="flex items-center gap-4 cursor-pointer hover:bg-rose-600 px-3 py-2 rounded-md text-lg transition-all text-white"
                            >
                                {item.icon}
                                {isExpanded && <span>{item.name}</span>}
                            </li>
                        )
                )}
            </ul>

            {/* Toggle Button */}
            {window.innerWidth < 768 && ( // Show toggle button only on smaller screens
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-rose-800 p-2 z-50 rounded-full shadow-md focus:outline-none"
                >
                    {isExpanded ? '<' : '>'}
                </button>
            )}
        </div>
    );
};

export default Sidebar;
