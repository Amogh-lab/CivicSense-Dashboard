import React, { useState } from 'react';
import { Search, Home, Bell, UserCircle, AlertCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const NavItem = ({ icon, label, href, current, onClick }) => {
  const content = (
    <div className={`${styles.navItem} ${current ? styles.navItemActive : ''}`}>
      <div className={styles.navItemIcon}>
        {React.cloneElement(icon, {
          className: current ? styles.navIconActive : '',
          fill: current ? 'currentColor' : 'none',
        })}
      </div>
      <span>{label}</span>
    </div>
  );

  return onClick ? (
    <button onClick={onClick} className={styles.navButton}>
      {content}
    </button>
  ) : (
    <Link to={href} className={styles.navLink}>
      {content}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // State for create post modal (unused but kept for future use)
  const [, setIsCreatePostModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { 
      icon: <Home />, 
      label: 'Explore', 
      href: '/explore' 
    },
    { 
      icon: <AlertCircle />, 
      label: 'Feed', 
      href: '/feed' 
    },
    { 
      icon: <div className={styles.reportIcon}>
              <FontAwesomeIcon icon={faSquarePlus} />
            </div>, 
      label: 'Report', 
      href: '/create-issue',
      onClick: (e) => {
        e.preventDefault();
        navigate('/create-issue');
      }
    },
    { 
      icon: <Bell />, 
      label: 'Alerts', 
      href: '/notifications' 
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Navbar - shown on md screens and up */}
      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          <Link to="/" className={styles.logo}>
            Civic Monitor
          </Link>
          
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>
              <Search size={16} />
            </div>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.navItems}>
            {navItems.map((item) => (
              <div key={item.href} className={styles.navItemWrapper}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`${styles.navButton} ${location.pathname === item.href ? styles.navButtonActive : ''}`}
                  >
                    <div className={styles.navItemIcon}>
                      {React.cloneElement(item.icon, {
                        className: location.pathname === item.href ? styles.navIconActive : '',
                        fill: location.pathname === item.href ? 'currentColor' : 'none',
                      })}
                    </div>
                    <span className={styles.navItemLabel}>{item.label}</span>
                  </button>
                ) : (
                  <NavItem
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    current={location.pathname === item.href}
                  />
                )}
              </div>
            ))}
            
            {/* Profile dropdown */}
            <div className={styles.profileContainer}>
              <div className={styles.profileButtonContainer}>
                <button 
                  className={styles.profileButton}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className={styles.profileAvatar}>
                    {user?.fullName?.[0]?.toUpperCase()}
                  </div>
                  <span className={styles.profileText}>Profile</span>
                </button>
              </div>
              
              {isProfileOpen && (
                <div className={styles.profileDropdown}>
                  <div className={styles.profileHeader}>
                    <div className={styles.profileName}>{user?.fullName}</div>
                    <div className={styles.profileEmail}>{user?.email}</div>
                  </div>
                  <div className={styles.profileMenu}>
                    <Link
                      to="/profile"
                      className={styles.profileMenuItem}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className={styles.profileMenuItem}
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/settings');
                      }}
                    >
                      Settings
                    </button>
                    <div className={styles.profileDivider} />
                    <button
                      onClick={handleLogout}
                      className={`${styles.profileMenuItem} ${styles.profileLogout}`}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navbar - shown on screens smaller than md */}
      <nav className={styles.mobileNav}>
        {navItems.map((item) => (
          <div key={item.href} className={styles.mobileNavItemWrapper}>
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className={`${styles.mobileNavItem} ${location.pathname === item.href ? styles.mobileNavItemActive : ''}`}
              >
                <div className={styles.mobileNavIcon}>
                  {React.cloneElement(item.icon, {
                    className: location.pathname === item.href ? styles.navIconActive : '',
                    fill: location.pathname === item.href ? 'currentColor' : 'none',
                  })}
                </div>
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                to={item.href}
                className={`${styles.mobileNavItem} ${location.pathname === item.href ? styles.mobileNavItemActive : ''}`}
              >
                <div className={styles.mobileNavIcon}>
                  {React.cloneElement(item.icon, {
                    className: location.pathname === item.href ? styles.navIconActive : '',
                    fill: location.pathname === item.href ? 'currentColor' : 'none',
                  })}
                </div>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
        
        {/* Mobile Profile Link */}
        <Link
          to="/profile"
          className={`${styles.mobileNavItem} ${location.pathname === '/profile' ? styles.mobileNavItemActive : ''}`}
        >
          <div className={styles.mobileNavIcon}>
            <UserCircle className={location.pathname === '/profile' ? styles.navIconActive : ''} />
          </div>
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
