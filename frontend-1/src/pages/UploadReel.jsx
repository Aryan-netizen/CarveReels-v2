import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';
import "./UploadReel.css"

function UploadReel() {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('other');
    const [preparationTime, setPreparationTime] = useState('30');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !caption || !image || !video || !price) {
            return handleError('Title, caption, image, video, and price are required');
        }

        if (price <= 0) {
            return handleError('Price must be greater than 0');
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('caption', caption);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('preparationTime', preparationTime);
            formData.append('files', image);
            formData.append('files', video);

            const token = localStorage.getItem('token');
            const url = "http://localhost:3000/food";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                setTitle('');
                setCaption('');
                setPrice('');
                setCategory('other');
                setPreparationTime('30');
                setImage(null);
                setVideo(null);
                setImagePreview(null);
                setVideoPreview(null);
                setTimeout(() => {
                    navigate('/my-reels');
                }, 1000);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            console.error('Error:', err);
            handleError('Error uploading reel');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="upload-container">
            <div className="upload-wrapper">
                <div className="upload-header">
                    <button className="back-btn" onClick={() => navigate('/home')}>
                        ← Back
                    </button>
                    <h1>📤 Create New Reel</h1>
                </div>

                <div className="upload-content">
                    <form onSubmit={handleSubmit} className="upload-form">
                        <div className="form-section">
                            <h2>Reel Details</h2>
                            
                            <div className="form-group">
                                <label>Reel Title</label>
                                <input
                                    type='text'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder='e.g., Homemade Pizza Recipe'
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Caption</label>
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder='Describe your reel... Add hashtags like #FoodLover #Cooking'
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type='number'
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder='0.00'
                                        step='0.01'
                                        min='0'
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="appetizer">🥗 Appetizer</option>
                                        <option value="main">🍽️ Main Course</option>
                                        <option value="dessert">🍰 Dessert</option>
                                        <option value="beverage">🥤 Beverage</option>
                                        <option value="other">🍴 Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Prep Time (min)</label>
                                    <input
                                        type='number'
                                        value={preparationTime}
                                        onChange={(e) => setPreparationTime(e.target.value)}
                                        min='5'
                                        max='120'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Media Files</h2>
                            
                            <div className="media-grid">
                                <div className="media-upload">
                                    <label>Upload Image</label>
                                    <div className="upload-box">
                                        <input
                                            type='file'
                                            accept='image/*'
                                            onChange={handleImageChange}
                                            id="image-input"
                                        />
                                        <label htmlFor="image-input" className="upload-label">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt='Preview' />
                                            ) : (
                                                <>
                                                    <span className="upload-icon">🖼️</span>
                                                    <span>Click to upload image</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="media-upload">
                                    <label>Upload Video</label>
                                    <div className="upload-box">
                                        <input
                                            type='file'
                                            accept='video/*'
                                            onChange={handleVideoChange}
                                            id="video-input"
                                        />
                                        <label htmlFor="video-input" className="upload-label">
                                            {videoPreview ? (
                                                <video src={videoPreview} controls />
                                            ) : (
                                                <>
                                                    <span className="upload-icon">🎬</span>
                                                    <span>Click to upload video</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type='button' 
                                className="cancel-btn"
                                onClick={() => navigate('/home')}
                            >
                                Cancel
                            </button>
                            <button 
                                type='submit' 
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Uploading...' : 'Publish Reel'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default UploadReel
