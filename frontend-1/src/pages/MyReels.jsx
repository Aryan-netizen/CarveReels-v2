import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { handleError } from '../../utils';
import EditReelModal from '../components/EditReelModal';
import "./MyReels.css"

function MyReels() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReel, setEditingReel] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const navigate = useNavigate();

    const fetchUserReels = async () => {
        try {
            const url = "http://localhost:3000/food/user/reels";
            const response = await fetch(url, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            const result = await response.json();
            
            if (result.success) {
                setReels(result.data);
            }
        } catch (err) {
            handleError('Error loading your reels');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (reelId) => {
        if (!window.confirm('Are you sure you want to delete this reel? This action cannot be undone.')) {
            return;
        }

        setDeleting(reelId);
        try {
            const response = await fetch(`http://localhost:3000/food/${reelId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Reel deleted successfully');
                setReels(reels.filter(r => r._id !== reelId));
            } else {
                toast.error(result.message || 'Failed to delete reel');
            }
        } catch (err) {
            toast.error('Error deleting reel');
            console.error(err);
        } finally {
            setDeleting(null);
        }
    };

    const handleUpdateReel = (updatedReel) => {
        setReels(reels.map(r => r._id === updatedReel._id ? updatedReel : r));
    };

    useEffect(() => {
        fetchUserReels();
    }, [])

    return (
        <div className="my-reels-container">
            <div className="my-reels-header">
                <button className="back-btn" onClick={() => navigate('/home')}>
                    ← Back
                </button>
                <h1>📹 My Reels</h1>
                <button className="upload-btn" onClick={() => navigate('/food')}>
                    + Create New
                </button>
            </div>

            <div className="my-reels-content">
                {loading ? (
                    <div className="loading">Loading your reels...</div>
                ) : reels.length > 0 ? (
                    <div className="reels-grid">
                        {reels.map((reel) => (
                            <div key={reel._id} className="my-reel-card">
                                <div className="reel-thumbnail">
                                    <img 
                                        src={reel.image}
                                        alt={reel.title}
                                    />
                                    <div className="play-overlay">
                                        <span>▶</span>
                                    </div>
                                </div>
                                <div className="reel-details">
                                    <h3>{reel.title}</h3>
                                    <p className="reel-caption">{reel.caption}</p>
                                    <div className="reel-stats">
                                        <span>❤️ {reel.likes || 0}</span>
                                        <span>💬 {reel.comments?.length || 0}</span>
                                    </div>
                                    <div className="reel-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => setEditingReel(reel)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(reel._id)}
                                            disabled={deleting === reel._id}
                                        >
                                            {deleting === reel._id ? '⏳ Deleting...' : '🗑️ Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📹</div>
                        <h2>No reels yet</h2>
                        <p>Start creating and sharing your food content</p>
                        <button className="create-btn" onClick={() => navigate('/food')}>
                            Create Your First Reel
                        </button>
                    </div>
                )}
            </div>

            {editingReel && (
                <EditReelModal 
                    reel={editingReel}
                    onClose={() => setEditingReel(null)}
                    onUpdate={handleUpdateReel}
                />
            )}

            <ToastContainer />
        </div>
    )
}

export default MyReels
