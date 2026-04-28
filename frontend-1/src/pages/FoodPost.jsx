import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';

function FoodPost() {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [foodPosts, setFoodPosts] = useState([]);
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
        
        if (!title || !caption || !image || !video) {
            return handleError('Title, caption, image and video are required');
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('caption', caption);
            formData.append('files', image);
            formData.append('files', video);

            const url = "http://localhost:3000/food";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                setTitle('');
                setCaption('');
                setImage(null);
                setVideo(null);
                setImagePreview(null);
                setVideoPreview(null);
                fetchFoodPosts();
            } else {
                handleError(result.message);
            }
        } catch (err) {
            console.error('Error:', err);
            handleError('Error uploading post');
        }
    }

    const fetchFoodPosts = async () => {
        try {
            const url = "http://localhost:3000/food";
            const response = await fetch(url, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            const result = await response.json();
            if (result.success) {
                setFoodPosts(result.data);
            }
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        fetchFoodPosts();
    }, [])

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Create Food Post</h1>
            
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '30px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Title</label>
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Enter post title...'
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Caption</label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder='Enter post caption...'
                        style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Image</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        style={{ marginTop: '5px' }}
                    />
                    {imagePreview && (
                        <img 
                            src={imagePreview} 
                            alt='Preview' 
                            style={{ maxWidth: '200px', marginTop: '10px' }}
                        />
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Video</label>
                    <input
                        type='file'
                        accept='video/*'
                        onChange={handleVideoChange}
                        style={{ marginTop: '5px' }}
                    />
                    {videoPreview && (
                        <video 
                            src={videoPreview} 
                            style={{ maxWidth: '200px', marginTop: '10px' }}
                            controls
                        />
                    )}
                </div>

                <button type='submit' style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Post
                </button>
            </form>

            <h2>Your Food Posts</h2>
            <div>
                {foodPosts && foodPosts.length > 0 ? (
                    foodPosts.map((post, index) => (
                        <div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px' }}>
                            <h3>{post.title}</h3>
                            <p>{post.caption}</p>
                            {post.image && (
                                <img 
                                    src={post.image} 
                                    alt={post.title}
                                    style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '10px' }}
                                />
                            )}
                            {post.video && (
                                <video 
                                    src={post.video}
                                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                                    controls
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <p>No posts yet</p>
                )}
            </div>

            <ToastContainer />
        </div>
    )
}

export default FoodPost
