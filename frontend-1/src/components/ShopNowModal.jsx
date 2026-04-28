import { useState } from 'react';
import { handleError, handleSuccess } from '../../utils';
import './ShopNowModal.css';

function ShopNowModal({ reel, onClose, onOrderSuccess }) {
    const [formData, setFormData] = useState({
        quantity: 1,
        price: reel?.menuItem?.price || 0,
        customerName: localStorage.getItem('loggedInUser') || '',
        customerPhone: '',
        customerEmail: '',
        deliveryAddress: '',
        specialInstructions: '',
        paymentMethod: 'cash'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.customerName || !formData.customerPhone || !formData.customerEmail || !formData.deliveryAddress || !formData.quantity || !formData.price) {
            return handleError('All fields are required');
        }

        if (formData.quantity <= 0 || formData.price <= 0) {
            return handleError('Quantity and price must be greater than 0');
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reelId: reel._id,
                    quantity: formData.quantity,
                    price: formData.price,
                    customerName: formData.customerName,
                    customerPhone: formData.customerPhone,
                    customerEmail: formData.customerEmail,
                    deliveryAddress: formData.deliveryAddress,
                    specialInstructions: formData.specialInstructions,
                    paymentMethod: formData.paymentMethod
                })
            });

            const result = await response.json();

            if (result.success) {
                handleSuccess('Order placed successfully!');
                onOrderSuccess();
                onClose();
            } else {
                handleError(result.message || 'Failed to place order');
            }
        } catch (err) {
            console.error('Order error:', err);
            handleError('Error placing order');
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = formData.quantity * formData.price;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🛒 Order Now</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="reel-info">
                    <img 
                        src={reel.image || 'https://via.placeholder.com/100'} 
                        alt={reel.title} 
                        className="reel-thumbnail"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100';
                        }}
                    />
                    <div className="reel-details">
                        <h3>{reel.title}</h3>
                        <p className="reel-caption">{reel.caption}</p>
                        <p className="reel-partner">By {reel.userName}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="order-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price per item (₹)</label>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                readOnly
                                required
                            />
                        </div>
                    </div>

                    <div className="total-price">
                        <span>Total Price:</span>
                        <span className="price-value">₹{totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="customerPhone"
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Delivery Address</label>
                        <textarea
                            name="deliveryAddress"
                            placeholder="Enter your full delivery address"
                            value={formData.deliveryAddress}
                            onChange={handleChange}
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Special Instructions (Optional)</label>
                        <textarea
                            name="specialInstructions"
                            placeholder="Any special requests or instructions..."
                            value={formData.specialInstructions}
                            onChange={handleChange}
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label>Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="cash">Cash on Delivery</option>
                            <option value="card">Credit/Debit Card</option>
                            <option value="upi">UPI</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ShopNowModal;
