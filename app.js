const res = require('express/lib/response');
const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/bookModel');
const bodyParser = require('body-parser');
const { append } = require('express/lib/response');
const bookRouter = require('./routes/bookRouter')(Book); // get access to book for router | inject the book to the router



const app = express();
const port = process.env.PORT || 3000;
if(process.env.ENV === 'Test') {
    console.log('This is a Test');
    const db = mongoose.connect('mongodb://localhost/bookAPI_Test');
} else {
    console.log('This is a for Real');
    const db = mongoose.connect('mongodb://localhost/bookAPI');
}

// these 2 lines of codes below are needed for bodyParser to work
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Create a router (which is now in the routes directory)
// const bookRouter = express.Router(); --------------------> moved to bookRouter

// wiring the router using 
app.use('/api', bookRouter);

//GET handler - This is just a generic message
app.get('/', (req, res)=> {
    res.send('Welcome to my Nodemon API!');
});

app.server = app.listen(port, ()=>{
    console.log(`Running on port ${port}`);
});

module.exports = app;