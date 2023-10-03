const express=require('express');
const app=express();
const connection=require('./config/db');
const cors = require('cors');
const helmet=require('helmet');
const dotenv=require('dotenv');


dotenv.config();
// Connecting Database
connection();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

// Init Middleware
app.use(express.json({extended:false}));

app.get('/',(req,res)=>res.send('API is running'));

// Define Routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profiles'));
app.use('/api/posts',require('./routes/api/posts'));

const PORT=process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));