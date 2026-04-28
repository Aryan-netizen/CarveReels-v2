import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../utils';
import './MenuManagement.css';

function MenuManagement() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'other',
        preparationTime: '30'
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/menu/my-items', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                setMenuItems(result.data);
            } else {
                handleError(result.message || 'Failed to fetch menu items');
            }
        } catch (err) {
            console.error('Fetch menu items error:', err);
            handleError('Error fetching menu items');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price) {
            return handleError('Name and price are required');
        }

        if (!imagePreview && !editingItem) {
            return handleError('Image is required');
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formDataObj = new FormData();
            formDataObj.append('name', formData.name);
            formDataObj.append('description', formData.description);
            formDataObj.append('price', formData.price);
            formDataObj.append('category', formData.category);
            formDataObj.append('preparationTime', formData.preparationTime);

            if (imagePreview && imagePreview.startsWith('data:')) {
                const blob = await fetch(imagePreview).then(r => r.blob());
                formDataObj.append('images', blob, 'menu-item.jpg');
            }

            const url = editingItem 
                ? `http://localhost:3000/menu/update/${editingItem._id}`
                : 'http://localhost:3000/menu/add';

            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataObj
            });

            const result = await response.json();

            if (result.success) {
                handleSuccess(editingItem ? 'Menu item updated successfully' : 'Menu item added successfully');
                setFormData({ name: '', description: '', price: '', category: 'other', preparationTime: '30' });
                setImagePreview(null);
                setEditingItem(null);
                setShowForm(false);
                fetchMenuItems();
            } else {
                handleError(result.message || 'Failed to save menu item');
            }
        } catch (err) {
            console.error('Save menu item error:', err);
            handleError('Error saving menu item');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            preparationTime: item.preparationTime
        });
        setImagePreview(item.image);
        setShowForm(true);
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/menu/delete/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                handleSuccess('Menu item deleted successfully');
                fetchMenuItems();
            } else {
                handleError(result.message || 'Failed to delete menu item');
            }
        } catch (err) {
            console.error('Delete menu item error:', err);
            handleError('Error deleting menu item');
        }
    };

    const toggleAvailability = async (itemId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/menu/toggle-availability/${itemId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                handleSuccess(result.data.available ? 'Item is now available' : 'Item is now unavailable');
                fetchMenuItems();
            } else {
                handleError(result.message || 'Failed to update availability');
            }
        } catch (err) {
            console.error('Toggle availability error:', err);
            handleError('Error updating availability');
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

    if (loading && !showForm) {
        return (
            <div className="menu-management-container">
                <div className="loading">Loading menu items...</div>
            </div>
        );
    }

    return (
        <div className="menu-management-container">
            <div className="menu-header">
                <h1>📋 Menu Management</h1>
                <p>Manage your food items and prices</p>
            </div>

            {!showForm ? (
                <>
                    <button className="add-item-btn" onClick={() => setShowForm(true)}>
                        ➕ Add New Item
                    </button>

                    {menuItems.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🍽️</div>
                            <h2>No Menu Items Yet</h2>
                            <p>Start by adding your first menu item</p>
                            <button className="create-btn" onClick={() => setShowForm(true)}>
                                Add First Item
                            </button>
                        </div>
                    ) : (
                        <div className="menu-grid">
                            {menuItems.map((item) => (
                                <div key={item._id} className="menu-card">
                                    <div className="menu-image-container">
                                        <img src={item.image} alt={item.name} className="menu-image" />
                                        <div className="category-badge">
                                            {getCategoryEmoji(item.category)} {item.category}
                                        </div>
                                        <div className={`availability-badge ${item.available ? 'available' : 'unavailable'}`}>
                                            {item.available ? '✓ Available' : '✗ Unavailable'}
                                        </div>
                                    </div>

                                    <div className="menu-details">
                                        <h3>{item.name}</h3>
                                        <p className="description">{item.description}</p>
                                        
                                        <div className="menu-info">
                                            <div className="info-row">
                                                <span className="label">Price:</span>
                                                <span className="price">₹{item.price}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="label">Prep Time:</span>
                                                <span className="value">{item.preparationTime} min</span>
                                            </div>
                                            {item.rating > 0 && (
                                                <div className="info-row">
                                                    <span className="label">Rating:</span>
                                                    <span className="rating">⭐ {item.rating.toFixed(1)} ({item.reviews})</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="menu-actions">
                                            <button 
                                                className="availability-btn"
                                                onClick={() => toggleAvailability(item._id, item.available)}
                                            >
                                                {item.available ? '🔴 Unavailable' : '🟢 Available'}
                                            </button>
                                            <button 
                                                className="edit-btn"
                                                onClick={() => handleEdit(item)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="form-container">
                    <div className="form-header">
                        <h2>{editingItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}</h2>
                        <button className="close-btn" onClick={() => {
                            setShowForm(false);
                            setEditingItem(null);
                            setImagePreview(null);
                            setFormData({ name: '', description: '', price: '', category: 'other', preparationTime: '30' });
                        }}>✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="menu-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Item Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Butter Chicken"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your dish..."
                                rows="3"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="appetizer">🥗 Appetizer</option>
                                    <option value="main">🍽️ Main Course</option>
                                    <option value="dessert">🍰 Dessert</option>
                                    <option value="beverage">🥤 Beverage</option>
                                    <option value="other">🍴 Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Preparation Time (min)</label>
                                <input
                                    type="number"
                                    name="preparationTime"
                                    value={formData.preparationTime}
                                    onChange={handleChange}
                                    min="5"
                                    max="120"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Item Image *</label>
                            <div className="image-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    id="image-input"
                                />
                                <label htmlFor="image-input" className="upload-label">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="image-preview" />
                                    ) : (
                                        <>
                                            <span className="upload-icon">📸</span>
                                            <span>Click to upload image</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingItem(null);
                                    setImagePreview(null);
                                    setFormData({ name: '', description: '', price: '', category: 'other', preparationTime: '30' });
                                }}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default MenuManagement;
