# CraveReels - Project Documentation

## Project Overview

**CraveReels** is a full-stack web application that combines Instagram-style short video content with food ordering functionality. It's a platform where food partners can showcase their dishes through engaging reels, and customers can discover, like, and order food directly from the content.

## Key Features

### 1. Role-Based Authentication
- **Two User Types**: Regular Users and Food Partners
- **Authentication Methods**:
  - Email/Password signup and login
  - Google OAuth integration
  - JWT token-based session management
- **Separate Auth Endpoints**:
  - `/auth/user` - For regular users
  - `/auth/foodpartner` - For food partners

### 2. Food Reel Management (Food Partners Only)
- Upload food reels with image and video
- Add reel details: title, caption, price, category, preparation time
- Automatic menu item creation when uploading a reel
- Edit reel details and linked menu items
- Delete reels and associated menu items
- View all personal reels in "My Reels" section

### 3. Reels Feed (All Users)
- Instagram-style infinite scroll feed
- Display all food reels from all food partners
- Pagination (10 reels per page)
- Like/Unlike functionality
- Comment and share buttons
- View food partner's complete menu from each reel

### 4. Menu Management System
- Food partners can manage their menu items
- Each menu item includes:
  - Name, description, price
  - Category (appetizer, main, dessert, beverage, other)
  - Preparation time
  - Availability status
  - Rating and reviews
- Menu items are automatically created when reels are uploaded
- Menu items can be edited or deleted independently

### 5. Order System (Users Only)
- "Shop Now" button on each reel to place orders
- Order details include:
  - Quantity and price (auto-populated from menu)
  - Customer information (name, phone, email)
  - Delivery address
  - Special instructions
  - Payment method (Cash, Card, UPI)
- View order history in "My Orders" section
- Track order status

### 6. User Interface
- **Dark Theme**: Modern dark background (#0a0a0a) with orange accents (#ffa500)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Sticky Navbar**: Navigation bar stays visible while scrolling
- **Smooth Animations**: Fade-in, slide-up, and hover effects
- **Toast Notifications**: Success and error messages

## Technology Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: CSS3 with custom dark theme
- **HTTP Client**: Fetch API
- **Notifications**: React Toastify
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer with Cloudinary storage
- **CORS**: Enabled for frontend communication

### External Services
- **Cloudinary**: Image and video storage
- **Google OAuth**: Third-party authentication

## Project Structure

```
CraveReels/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.js (User auth)
│   │   ├── FoodPartnerAuthController.js (Food partner auth)
│   │   ├── FoodController.js (Reel management)
│   │   ├── MenuController.js (Menu management)
│   │   ├── OrderController.js (Order management)
│   │   └── googleAuth.js (Google OAuth)
│   ├── Models/
│   │   ├── UserModel.js
│   │   ├── FoodPartnerModel.js
│   │   ├── FoodModel.js (Reels)
│   │   ├── MenuModel.js
│   │   ├── OrderModel.js
│   │   └── db.js (Database connection)
│   ├── Routes/
│   │   ├── UserAuthRouter.js
│   │   ├── FoodPartnerAuthRouter.js
│   │   ├── FoodRouter.js
│   │   ├── MenuRouter.js
│   │   └── OrderRouter.js
│   ├── Middlewares/
│   │   ├── Auth.js (JWT verification)
│   │   ├── AuthValidation.js
│   │   └── imageUploader.js
│   ├── index.js (Main server file)
│   ├── package.json
│   └── .env (Environment variables)
│
└── frontend-1/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Home.jsx
    │   │   ├── ReelsView.jsx (Main feed)
    │   │   ├── UploadReel.jsx
    │   │   ├── MyReels.jsx
    │   │   ├── MyOrders.jsx
    │   │   ├── MenuManagement.jsx
    │   │   ├── RoleSelection.jsx
    │   │   └── GoogleLogin.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ShopNowModal.jsx
    │   │   ├── FoodPartnerMenu.jsx
    │   │   └── EditReelModal.jsx
    │   ├── App.jsx (Main app component)
    │   ├── api.js (API configuration)
    │   └── index.css (Global styles)
    ├── package.json
    └── .env (Environment variables)
```

## API Endpoints

### Authentication
- `POST /auth/user/signup` - User registration
- `POST /auth/user/login` - User login
- `POST /auth/user/google-login` - Google OAuth for users
- `POST /auth/foodpartner/signup` - Food partner registration
- `POST /auth/foodpartner/login` - Food partner login
- `POST /auth/foodpartner/google-login` - Google OAuth for food partners

### Reels (Food)
- `GET /food` - Get all reels (paginated)
- `GET /food/user/reels` - Get user's reels (protected)
- `POST /food` - Upload new reel (protected, food partners only)
- `PUT /food/:reelId` - Update reel (protected)
- `DELETE /food/:reelId` - Delete reel (protected)

### Menu
- `GET /menu` - Get all menu items
- `GET /menu/foodpartner/:id` - Get menu items for a food partner
- `POST /menu/add` - Add menu item (protected, food partners only)
- `PUT /menu/:id` - Update menu item (protected)
- `DELETE /menu/:id` - Delete menu item (protected)
- `PATCH /menu/:id/toggle` - Toggle availability (protected)

### Orders
- `POST /orders/create` - Create order (protected, users only)
- `GET /orders/user` - Get user's orders (protected)
- `GET /orders/foodpartner` - Get food partner's orders (protected)
- `PUT /orders/:id/status` - Update order status (protected)
- `DELETE /orders/:id` - Cancel order (protected)

## User Workflows

### Food Partner Workflow
1. Sign up as a food partner
2. Upload profile picture
3. Create reels with food images, videos, and pricing
4. Manage menu items
5. View orders from customers
6. Track order status

### Customer Workflow
1. Sign up as a regular user
2. Browse food reels in the feed
3. Like/comment on reels
4. View food partner's menu
5. Click "Shop Now" to place an order
6. Track orders in "My Orders"

## Security Features
- JWT authentication for protected routes
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Bearer token validation in middleware
- Input validation on both frontend and backend

## Database Schema

### User
- email, name, password, image, createdAt

### FoodPartner
- email, name, password, businessName, image, createdAt

### Food (Reels)
- title, caption, image, video, user (ref), userName, userImage
- menuItem (ref), likes, comments, createdAt

### Menu
- foodPartner (ref), name, description, price, image
- category, available, preparationTime, rating, reviews
- createdAt, updatedAt

### Order
- reelId (ref), customerId (ref), quantity, price, totalPrice
- customerName, customerPhone, customerEmail, deliveryAddress
- specialInstructions, paymentMethod, status, createdAt

## How to Run

### Backend
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:3000`

### Frontend
```bash
cd frontend-1
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_ID=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Key Implementation Details

### Infinite Scroll
- Uses Intersection Observer API
- Loads 10 reels per page
- Automatically fetches next page when user scrolls to bottom

### Image/Video Upload
- Uses Multer for file handling
- Cloudinary for cloud storage
- Supports both image and video formats
- Auto-generates public IDs for files

### Menu Item Auto-Creation
- When a food partner uploads a reel, a menu item is automatically created
- Menu item is linked to the reel via reference
- Editing a reel updates the linked menu item
- Deleting a reel deletes the linked menu item

### Order Management
- Price is auto-populated from menu item
- Total price calculated as quantity × price
- Orders can be tracked by status
- Food partners can see all orders for their reels

## Future Enhancements
- Payment gateway integration (Stripe, Razorpay)
- Real-time notifications
- Advanced search and filtering
- User ratings and reviews
- Delivery tracking
- Admin dashboard
- Analytics and reporting

---

**Project Created**: 2026
**Technology**: MERN Stack (MongoDB, Express, React, Node.js)
**Status**: In Development
