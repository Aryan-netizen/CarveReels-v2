import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../utils';
import './MyOrders.css';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/orders/my-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                setOrders(result.data);
            } else {
                handleError(result.message || 'Failed to fetch orders');
            }
        } catch (err) {
            console.error('Fetch orders error:', err);
            handleError('Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/orders/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderId })
            });

            const result = await response.json();
            if (result.success) {
                handleSuccess('Order cancelled successfully');
                fetchOrders();
            } else {
                handleError(result.message || 'Failed to cancel order');
            }
        } catch (err) {
            console.error('Cancel order error:', err);
            handleError('Error cancelling order');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#ffa500',
            confirmed: '#3498db',
            preparing: '#9b59b6',
            ready: '#2ecc71',
            delivered: '#27ae60',
            cancelled: '#e74c3c'
        };
        return colors[status] || '#999';
    };

    const getStatusEmoji = (status) => {
        const emojis = {
            pending: '⏳',
            confirmed: '✅',
            preparing: '👨‍🍳',
            ready: '🎉',
            delivered: '📦',
            cancelled: '❌'
        };
        return emojis[status] || '📋';
    };

    if (loading) {
        return (
            <div className="my-orders-container">
                <div className="loading">Loading your orders...</div>
            </div>
        );
    }

    return (
        <div className="my-orders-container">
            <div className="orders-header">
                <h1>📋 My Orders</h1>
                <p>Track your food orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🛒</div>
                    <h2>No Orders Yet</h2>
                    <p>You haven't placed any orders yet. Start exploring and order your favorite food!</p>
                    <button className="explore-btn" onClick={() => navigate('/reels')}>
                        Explore Reels
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <img 
                                        src={order.reel?.image} 
                                        alt={order.reel?.title}
                                        className="order-image"
                                    />
                                    <div className="order-details">
                                        <h3>{order.reel?.title}</h3>
                                        <p className="partner-name">By {order.foodPartner?.businessName || order.foodPartner?.name}</p>
                                        <p className="order-id">Order ID: {order._id.slice(-8)}</p>
                                    </div>
                                </div>
                                <div className="order-status" style={{ borderColor: getStatusColor(order.status) }}>
                                    <span className="status-emoji">{getStatusEmoji(order.status)}</span>
                                    <span className="status-text" style={{ color: getStatusColor(order.status) }}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="order-body">
                                <div className="order-row">
                                    <span className="label">Quantity:</span>
                                    <span className="value">{order.quantity} item(s)</span>
                                </div>
                                <div className="order-row">
                                    <span className="label">Price per item:</span>
                                    <span className="value">₹{order.price.toFixed(2)}</span>
                                </div>
                                <div className="order-row">
                                    <span className="label">Total Price:</span>
                                    <span className="value total">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="order-row">
                                    <span className="label">Delivery Address:</span>
                                    <span className="value">{order.deliveryAddress}</span>
                                </div>
                                <div className="order-row">
                                    <span className="label">Payment Method:</span>
                                    <span className="value">{order.paymentMethod.toUpperCase()}</span>
                                </div>
                                {order.specialInstructions && (
                                    <div className="order-row">
                                        <span className="label">Special Instructions:</span>
                                        <span className="value">{order.specialInstructions}</span>
                                    </div>
                                )}
                                <div className="order-row">
                                    <span className="label">Ordered on:</span>
                                    <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="order-actions">
                                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                    <button 
                                        className="cancel-order-btn"
                                        onClick={() => cancelOrder(order._id)}
                                    >
                                        Cancel Order
                                    </button>
                                )}
                                <button className="contact-btn">
                                    Contact Restaurant
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
