require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const FoodRouter = require('./Routes/FoodRouter');

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

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/food', FoodRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})