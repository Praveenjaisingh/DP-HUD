const express = require('express');
const cors = require('cors');
const path = require("path");

const userRoutes = require('./Routes/vrRoutes');
const errorHandler = require("./Middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"../public")));
app.use('/api/users', userRoutes);
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"));
});
app.use(errorHandler);

module.exports = app;