import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';
import "./Home.css"

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [userImage, setUserImage] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const fetchUserData = async () => {
        try {
            const url = "http://localhost:3000/products";
            const response = await fetch(url, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            const result = await response.json();
            if (result.data && result.data.image) {
                setUserImage(result.data.image);
                localStorage.setItem('userImage', result.data.image);
            }
        } catch (err) {
            handleError(err);
        }
    }
    
    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="welcome-section">
                    <div className="welcome-card">
                        <div className="welcome-header">
                            <div className="user-profile">
                                {userImage && (
                                    <img 
                                        src={userImage} 
                                        alt={loggedInUser}
                                        className="user-avatar-large"
                                    />
                                )}
                                <div className="user-info">
                                    <h2>Welcome, {loggedInUser}! 👋</h2>
                                    <p>Ready to explore amazing food content?</p>
                                </div>
                            </div>
                        </div>

                        <div className="action-cards">
                            <div className="action-card" onClick={() => navigate('/reels')}>
                                <div className="card-icon">🎬</div>
                                <h3>Explore Reels</h3>
                                <p>Discover delicious food content from creators</p>
                                <button className="card-btn">Start Exploring →</button>
                            </div>

                            <div className="action-card" onClick={() => navigate('/food')}>
                                <div className="card-icon">📤</div>
                                <h3>Upload Reel</h3>
                                <p>Share your culinary creations with the community</p>
                                <button className="card-btn">Create Reel →</button>
                            </div>

                            <div className="action-card" onClick={() => navigate('/my-reels')}>
                                <div className="card-icon">📹</div>
                                <h3>My Reels</h3>
                                <p>View and manage your uploaded content</p>
                                <button className="card-btn">View Reels →</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="stat-card">
                        <div className="stat-number">1.2K</div>
                        <div className="stat-label">Reels</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">5.8K</div>
                        <div className="stat-label">Creators</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">45K</div>
                        <div className="stat-label">Followers</div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default Home
