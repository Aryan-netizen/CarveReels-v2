import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './EditReelModal.css';

function EditReelModal({ reel, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        title: reel.title,
        caption: reel.caption,
        price: reel.menuItem?.price || '',
        category: reel.menuItem?.category || 'other',
        preparationTime: reel.menuItem?.preparationTime || 30
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('caption', formData.caption);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('preparationTime', formData.preparationTime);

            const response = await fetch(`http://localhost:3000/food/${reel._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                body: formDataToSend
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Reel updated successfully');
                onUpdate(result.data);
                onClose();
            } else {
                toast.error(result.message || 'Failed to update reel');
            }
        } catch (err) {
            toast.error('Error updating reel');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Reel</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Caption</label>
                        <textarea
                            name="caption"
                            value={formData.caption}
                            onChange={handleChange}
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="other">Other</option>
                                <option value="appetizer">Appetizer</option>
                                <option value="main">Main Course</option>
                                <option value="dessert">Dessert</option>
                                <option value="beverage">Beverage</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Preparation Time (minutes)</label>
                        <input
                            type="number"
                            name="preparationTime"
                            value={formData.preparationTime}
                            onChange={handleChange}
                            min="1"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                <ToastContainer />
            </div>
        </div>
    );
}

export default EditReelModal;
