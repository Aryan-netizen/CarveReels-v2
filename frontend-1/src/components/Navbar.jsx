import { useNavigate, useLocation } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import "./Navbar.css"

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userImage = localStorage.getItem('userImage');
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('userImage');
        localStorage.removeItem('userRole');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const isActive = (path) => location.pathname === path;

    // Don't show navbar on login/signup pages
    if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/role-selection') {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand" onClick={() => navigate('/home')}>
                    <span className="brand-icon">🍕</span>
                    <h1>CraveReels</h1>
                </div>

                <div className="navbar-menu">
                    <button 
                        className={`nav-link ${isActive('/reels') ? 'active' : ''}`}
                        onClick={() => navigate('/reels')}
                    >
                        <span className="nav-icon">🎬</span>
                        <span>Explore</span>
                    </button>
                    
                    {token && userRole === 'foodpartner' && (
                        <>
                            <button 
                                className={`nav-link ${isActive('/food') ? 'active' : ''}`}
                                onClick={() => navigate('/food')}
                            >
                                <span className="nav-icon">📤</span>
                                <span>Upload</span>
                            </button>
                            
                            <button 
                                className={`nav-link ${isActive('/my-reels') ? 'active' : ''}`}
                                onClick={() => navigate('/my-reels')}
                            >
                                <span className="nav-icon">📹</span>
                                <span>My Reels</span>
                            </button>

                            <button 
                                className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
                                onClick={() => navigate('/menu')}
                            >
                                <span className="nav-icon">📋</span>
                                <span>Menu</span>
                            </button>
                        </>
                    )}

                    {token && userRole === 'user' && (
                        <button 
                            className={`nav-link ${isActive('/my-orders') ? 'active' : ''}`}
                            onClick={() => navigate('/my-orders')}
                        >
                            <span className="nav-icon">📋</span>
                            <span>My Orders</span>
                        </button>
                    )}
                </div>

                <div className="navbar-user">
                    {token ? (
                        <>
                            {userImage && (
                                <img 
                                    src={userImage} 
                                    alt={loggedInUser}
                                    className="user-avatar"
                                    title={loggedInUser}
                                />
                            )}
                            <span className="user-name">{loggedInUser}</span>
                            <span className="user-role">{userRole === 'foodpartner' ? '👨‍🍳' : '👤'}</span>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="auth-btn login-btn"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                            <button 
                                className="auth-btn signup-btn"
                                onClick={() => navigate('/role-selection')}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
