import { useNavigate } from 'react-router-dom';
import "./RoleSelection.css"

function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="role-container">
            <div className="role-wrapper">
                <div className="role-header">
                    <h1>🍕 CraveReels</h1>
                    <p>Choose your role to get started</p>
                </div>

                <div className="role-cards">
                    <div className="role-card user-card" onClick={() => navigate('/signup?role=user')}>
                        <div className="role-icon">👤</div>
                        <h2>User</h2>
                        <p>Browse and discover amazing food content from creators</p>
                        <ul className="role-features">
                            <li>✓ Watch food reels</li>
                            <li>✓ Like and comment</li>
                            <li>✓ Follow creators</li>
                            <li>✓ Save favorites</li>
                        </ul>
                        <button className="role-btn">Continue as User</button>
                    </div>

                    <div className="role-card partner-card" onClick={() => navigate('/signup?role=foodpartner')}>
                        <div className="role-icon">👨‍🍳</div>
                        <h2>Food Partner</h2>
                        <p>Create and share your culinary content with the community</p>
                        <ul className="role-features">
                            <li>✓ Create reels</li>
                            <li>✓ Build audience</li>
                            <li>✓ Manage content</li>
                            <li>✓ Analytics</li>
                        </ul>
                        <button className="role-btn">Continue as Food Partner</button>
                    </div>
                </div>

                <p className="role-footer">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    )
}

export default RoleSelection
