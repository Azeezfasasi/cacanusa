import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../../context/AuthContext';

export default function DashboardHeader({ onToggleSidebar, onToggleMobileMenu }) {
  const { user, logout } = useAuth();
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
  const avatar = user && user.avatar ? user.avatar : '/images/profile1.jpg';
  const role = user?.role ? user.role.replace('-', ' ') : 'User';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Fetch logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/logo');
        if (response.ok) {
          const data = await response.json();
          if (data.logo) {
            setLogo(data.logo);
          }
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      } finally {
        setLogoLoading(false);
      }
    };
    
    fetchLogo();
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-23 md:h-27">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger: visible on small screens */}
            <button
              aria-label="Open menu"
              onClick={onToggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <button
              aria-label="Toggle sidebar"
              onClick={onToggleSidebar}
              className="hidden md:inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-3">
              {!logoLoading && logo ? (
                <div style={{ width: `${logo.width}px`, height: `${logo.height}px`, position: 'relative', maxWidth: '150px' }}>
                  <Image 
                    src={logo.url} 
                    alt={logo.alt} 
                    fill
                    sizes="(max-width: 768px) 80px, 100px"
                    className="object-contain rounded-md p-1" 
                    priority
                  />
                </div>
              ) : (
                <Image 
                  src="/images/cananusatrans.png" 
                  alt="CANAN USA Logo" 
                  width={100} 
                  height={40} 
                  className="w-14 md:w-16 block rounded-md p-1" 
                  priority
                />
              )}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button aria-label="Notifications" className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-900"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className="rounded-[50%] overflow-hidden">
                  <Image src={avatar} alt="User avatar" width={32} height={32} className="object-cover h-10 w-10" />
                </div>
                <div className='flex flex-col items-start'>
                  <span className="hidden sm:block text-sm text-gray-700">{fullName || 'User'}</span>
                  <span className="hidden sm:block text-sm text-gray-700">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                </div>
                <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fade-in">
                  <ul className="py-1">
                    <li>
                      <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition w-full text-left">Back to Home</Link>
                    </li>
                    {user?.role === 'admin' || user?.role === 'committee' || user?.role === 'it-support' ? (
                    <li>
                      <Link href="/dashboard/member-registration-request" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition w-full text-left">Registration Requests</Link>
                    </li>
                    ) : null}
                    {user?.role === 'admin' || user?.role === 'committee' || user?.role === 'it-support' ? (
                    <li>
                      <Link href="/dashboard/my-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition w-full text-left">Profile</Link>
                    </li>
                    ) : null}
                    <li>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition">Logout</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
