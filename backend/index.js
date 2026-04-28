require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const UserAuthRouter = require('./Routes/UserAuthRouter');
const FoodPartnerAuthRouter = require('./Routes/FoodPartnerAuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const FoodRouter = require('./Routes/FoodRouter');
const OrderRouter = require('./Routes/OrderRouter');
const MenuRouter = require('./Routes/MenuRouter');

require('./Models/db');
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors(
    {
        origin: 'http://localhost:5173',
    }
));

app.get('/ping', (req, res) => {
    res.send('PONG');
});

// User authentication routes
app.use('/auth/user', UserAuthRouter);

// Food Partner authentication routes
app.use('/auth/foodpartner', FoodPartnerAuthRouter);

app.use('/products', ProductRouter);
app.use('/food', FoodRouter);
app.use('/orders', OrderRouter);
app.use('/menu', MenuRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})