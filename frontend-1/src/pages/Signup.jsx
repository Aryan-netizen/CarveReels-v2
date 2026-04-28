import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';
import "./Auth.css"

function Signup() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'user';
    
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        businessName: '',
        role: role
    })
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        setSignupInfo(prev => ({
            ...prev,
            role: role
        }));
    }, [role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, businessName } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email and password are required')
        }
        
        if (role === 'foodpartner' && !businessName) {
            return handleError('Business name is required for food partners')
        }
        
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            if (role === 'foodpartner') {
                formData.append('businessName', businessName);
            }
            if (profileImage) {
                formData.append('images', profileImage);
            }

            const endpoint = role === 'foodpartner' ? 'foodpartner' : 'user';
            const url = `http://localhost:3000/auth/${endpoint}/signup`;
            const response = await fetch(url, {
                method: "POST",
                body: formData
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }

    const roleTitle = role === 'foodpartner' ? 'Food Partner' : 'User';
    const roleEmoji = role === 'foodpartner' ? '👨‍🍳' : '👤';

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-left">
                    <div className="auth-brand">
                        <h1>🍕 CraveReels</h1>
                        <p>Join as {roleTitle}</p>
                    </div>
                    <div className="auth-features">
                        {role === 'foodpartner' ? (
                            <>
                                <div className="feature">
                                    <span className="feature-icon">🎥</span>
                                    <p>Create food content</p>
                                </div>
                                <div className="feature">
                                    <span className="feature-icon">👥</span>
                                    <p>Build your audience</p>
                                </div>
                                <div className="feature">
                                    <span className="feature-icon">🌟</span>
                                    <p>Become a food influencer</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="feature">
                                    <span className="feature-icon">🎬</span>
                                    <p>Watch amazing food reels</p>
                                </div>
                                <div className="feature">
                                    <span className="feature-icon">❤️</span>
                                    <p>Like and comment</p>
                                </div>
                                <div className="feature">
                                    <span className="feature-icon">🔖</span>
                                    <p>Save your favorites</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-container">
                        <h2>Create Account</h2>
                        <p className="auth-subtitle">Sign up as {roleTitle}</p>

                        <form onSubmit={handleSignup} className="auth-form">
                            <div className="form-group">
                                <label htmlFor='name'>Full Name</label>
                                <input
                                    id='name'
                                    type='text'
                                    name='name'
                                    placeholder='John Doe'
                                    value={signupInfo.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor='email'>Email Address</label>
                                <input
                                    id='email'
                                    type='email'
                                    name='email'
                                    placeholder='you@example.com'
                                    value={signupInfo.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor='password'>Password</label>
                                <input
                                    id='password'
                                    type='password'
                                    name='password'
                                    placeholder='••••••••'
                                    value={signupInfo.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {role === 'foodpartner' && (
                                <div className="form-group">
                                    <label htmlFor='businessName'>Business Name</label>
                                    <input
                                        id='businessName'
                                        type='text'
                                        name='businessName'
                                        placeholder='Your restaurant or food brand'
                                        value={signupInfo.businessName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor='profileImage'>Profile Picture (Optional)</label>
                                <div className="image-upload">
                                    <input
                                        id='profileImage'
                                        type='file'
                                        accept='image/*'
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <div className="image-preview">
                                            <img 
                                                src={imagePreview} 
                                                alt='Profile Preview'
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type='submit' className="auth-btn" disabled={loading}>
                                {loading ? "Creating account..." : "Sign Up"}
                            </button>
                        </form>

                        <p className="auth-footer">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                        <p className="auth-footer">
                            Want to change role? <Link to="/role-selection">Go back</Link>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Signup
