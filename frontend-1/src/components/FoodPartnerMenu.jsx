import { useEffect, useState } from 'react';
import { handleError } from '../../utils';
import './FoodPartnerMenu.css';

function FoodPartnerMenu({ foodPartnerId, onClose }) {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenuItems();
    }, [foodPartnerId]);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`http://localhost:3000/menu/partner/${foodPartnerId}`);
            const result = await response.json();

            if (result.success) {
                setMenuItems(result.data);
            } else {
                handleError(result.message || 'Failed to fetch menu');
            }
        } catch (err) {
            console.error('Fetch menu error:', err);
            handleError('Error fetching menu');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryEmoji = (category) => {
        const emojis = {
            appetizer: '🥗',
            main: '🍽️',
            dessert: '🍰',
            beverage: '🥤',
            other: '🍴'
        };
        return emojis[category] || '🍴';
    };

    return (
        <div className="menu-modal-overlay" onClick={onClose}>
            <div className="menu-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="menu-modal-header">
                    <h2>📋 Food Partner Menu</h2>
                    <button className="menu-close-btn" onClick={onClose}>✕</button>
                </div>

                {loading ? (
                    <div className="menu-loading">Loading menu...</div>
                ) : menuItems.length === 0 ? (
                    <div className="menu-empty">
                        <p>No menu items available</p>
                    </div>
                ) : (
                    <div className="menu-items-list">
                        {menuItems.map((item) => (
                            <div key={item._id} className="menu-item-row">
                                <div className="menu-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="menu-item-info">
                                    <div className="menu-item-header">
                                        <h4>{item.name}</h4>
                                        <span className="menu-category-badge">
                                            {getCategoryEmoji(item.category)} {item.category}
                                        </span>
                                    </div>
                                    {item.description && (
                                        <p className="menu-item-description">{item.description}</p>
                                    )}
                                    <div className="menu-item-footer">
                                        <div className="menu-item-details">
                                            <span className="menu-price">₹{item.price}</span>
                                            <span className="menu-prep-time">⏱️ {item.preparationTime} min</span>
                                            {item.rating > 0 && (
                                                <span className="menu-rating">⭐ {item.rating.toFixed(1)}</span>
                                            )}
                                        </div>
                                        {!item.available && (
                                            <span className="menu-unavailable">Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FoodPartnerMenu;
