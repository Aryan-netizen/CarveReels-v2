import { useEffect, useState, useRef, useCallback } from 'react'
import { handleError } from '../../utils';
import ShopNowModal from '../components/ShopNowModal';
import FoodPartnerMenu from '../components/FoodPartnerMenu';
import './ReelsView.css'

function ReelsView() {
    const [reels, setReels] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [likedReels, setLikedReels] = useState(new Set());
    const [selectedReel, setSelectedReel] = useState(null);
    const [showShopModal, setShowShopModal] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectedFoodPartnerId, setSelectedFoodPartnerId] = useState(null);
    const observerTarget = useRef(null);

    const fetchReels = useCallback(async (pageNum) => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        try {
            const url = `http://localhost:3000/food?page=${pageNum}`;
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                setReels(prev => [...prev, ...result.data]);
                setHasMore(pageNum < result.pagination.pages);
            }
        } catch (err) {
            handleError('Error loading reels');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]);

    useEffect(() => {
        fetchReels(1);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prev => prev + 1);
                fetchReels(page + 1);
            }
        });

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [page, hasMore, loading, fetchReels]);

    const toggleLike = (reelId) => {
        setLikedReels(prev => {
            const newSet = new Set(prev);
            if (newSet.has(reelId)) {
                newSet.delete(reelId);
            } else {
                newSet.add(reelId);
            }
            return newSet;
        });
    }

    const handleShopNow = (reel) => {
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'user') {
            handleError('Only users can place orders');
            return;
        }
        setSelectedReel(reel);
        setShowShopModal(true);
    }

    const handleOrderSuccess = () => {
        setShowShopModal(false);
        setSelectedReel(null);
    }

    const handleViewMenu = (foodPartnerId) => {
        setSelectedFoodPartnerId(foodPartnerId);
        setShowMenuModal(true);
    }

    return (
        <div className="reels-container">
            <div className="reels-header">
                <h1>🍕 CraveReels</h1>
                <p>Discover delicious food content</p>
            </div>

            <div className="reels-feed">
                {reels.map((reel, index) => (
                    <div key={`${reel._id}-${index}`} className="reel-card">
                        <div className="reel-header">
                            <div className="user-info">
                                <img 
                                    src={reel.userImage || 'https://via.placeholder.com/40'} 
                                    alt={reel.userName}
                                    className="user-avatar"
                                />
                                <div className="user-details">
                                    <h3>{reel.userName}</h3>
                                    <p className="reel-title">{reel.title}</p>
                                </div>
                            </div>
                            <button className="follow-btn">Follow</button>
                        </div>

                        <div className="reel-media">
                            <video 
                                src={reel.video}
                                controls
                                className="reel-video"
                            />
                            <img 
                                src={reel.image}
                                alt={reel.title}
                                className="reel-image"
                            />
                        </div>

                        <div className="reel-actions">
                            <button 
                                className={`action-btn like-btn ${likedReels.has(reel._id) ? 'liked' : ''}`}
                                onClick={() => toggleLike(reel._id)}
                            >
                                <span className="icon">❤️</span>
                                <span>{likedReels.has(reel._id) ? 'Liked' : 'Like'}</span>
                            </button>
                            <button className="action-btn">
                                <span className="icon">💬</span>
                                <span>Comment</span>
                            </button>
                            <button className="action-btn">
                                <span className="icon">📤</span>
                                <span>Share</span>
                            </button>
                            <button 
                                className="action-btn shop-btn"
                                onClick={() => handleShopNow(reel)}
                            >
                                <span className="icon">🛒</span>
                                <span>Shop Now</span>
                            </button>
                            <button 
                                className="action-btn menu-btn"
                                onClick={() => handleViewMenu(reel.user._id)}
                            >
                                <span className="icon">📋</span>
                                <span>Menu</span>
                            </button>
                        </div>

                        <div className="reel-caption">
                            <p><strong>{reel.userName}</strong> {reel.caption}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div ref={observerTarget} className="observer-target">
                {loading && <div className="loading">Loading more reels...</div>}
                {!hasMore && reels.length > 0 && <div className="end-message">No more reels</div>}
            </div>

            {showShopModal && selectedReel && (
                <ShopNowModal 
                    reel={selectedReel}
                    onClose={() => setShowShopModal(false)}
                    onOrderSuccess={handleOrderSuccess}
                />
            )}
        </div>
    )
}

export default ReelsView

            {showMenuModal && selectedFoodPartnerId && (
                <FoodPartnerMenu 
                    foodPartnerId={selectedFoodPartnerId}
                    onClose={() => setShowMenuModal(false)}
                />
            )}
