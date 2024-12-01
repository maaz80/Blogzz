import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { FaHome, FaPlus, FaSignInAlt, FaUserPlus, FaThLarge, FaList } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { useSelector } from 'react-redux';
import authService from '../appwrite/auth';

const Sidebar = () => {
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 768);
    const [isAdmin, setIsAdmin] = useState(false)

    // Update sidebar state based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsExpanded(true);
            } else {
                setIsExpanded(false);
            }
        };

        // Set initial state and add event listener
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (authStatus) {
            authService.getCurrentUser().then((userData) => {
                if (userData) {
                    if (userData.labels.includes('admin')) {
                        setIsAdmin(true)
                    }
                }
            })
        }
    }, [authStatus])
    const SideItem = [
        { name: 'Home', slug: '/', icon: <FaHome />, active: true },
        { name: 'All Posts', slug: '/all-posts', icon: <FaList />, active: authStatus },
        { name: 'Add Post', slug: '/add-post', icon: <FaPlus />, active: authStatus },
        { name: 'Login', slug: '/login', icon: <FaSignInAlt />, active: !authStatus },
        { name: 'SignUp', slug: '/signup', icon: <FaUserPlus />, active: !authStatus },
        { name: 'Dashboard', slug: '/dashboard', icon: <FaThLarge />, active: isAdmin },
        { name: 'Profile', slug: '/profile', icon: <IoMdPerson />, active: authStatus },
        { name: 'Feedbacks', slug: '/feedback', icon: <IoMdPerson />, active: authStatus },
    ];

    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 h-screen ${isExpanded ? 'w-48' : 'w-12'
                } bg-rose-700 transition-all duration-300 rounded-r-3xl flex flex-col items-center z-40`}
        >
            {/* Logo Section */}
            <div className={`p-7 pl-2 ${isExpanded ? 'block' : 'hidden md:block'} w-full`}>
                <Logo width={'w-32'} height={'h-20'} />
            </div>

            {/* Sidebar Items */}
            <ul className={`flex-1 space-y-4 w-full ${isExpanded ? 'mt-0' : 'mt-24'} `}>
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
