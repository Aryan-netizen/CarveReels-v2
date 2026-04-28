import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [userImage, setUserImage] = useState('');
    const [products, setProducts] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const fetchProducts = async () => {
        try {
            const url = "http://localhost:3000/products";
            const response = await fetch(url, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            const result = await response.json();
            console.log(result);
            setProducts(result.product);
            if (result.data && result.data.image) {
                setUserImage(result.data.image);
            }
        } catch (err) {
            handleError(err);
        }
    }
    
    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                {userImage && (
                    <img 
                        src={userImage} 
                        alt={loggedInUser} 
                        style={{ 
                            width: '100px', 
                            height: '100px', 
                            borderRadius: '50%', 
                            objectFit: 'cover',
                            border: '3px solid #ccc'
                        }}
                    />
                )}
                <div>
                    <h1>Welcome {loggedInUser}</h1>
                    <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                        Logout
                    </button>
                    <button onClick={()=>{navigate("/food")}}>
                        Food
                    </button>
                </div>
            </div>
            
            <div>
                <h2>Products</h2>
                {
                    products && products?.map((item, index) => (
                        <div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px' }}>
                            <span>{item.name} : ${item.price}</span>
                        </div>
                    ))
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default Home
