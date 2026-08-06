const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Create an instance of the Express application
// express will manage many things behind the scenes
const app = express();

// you can omit .js
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// adds a new middleware function
// app.use((req, res, next) => {
//     console.log("In the middleware!");
//     // allow the req to go to the next middleware in line
//     next();
// })

// this middleware will parse the body of incoming requests and make it available in req.body
// registers a middleware function that will be executed for every incoming request
app.use(bodyParser.urlencoded({ extended: false }));
// it serves all the files in the public folder as static files, so they can be accessed by the browser
app.use(express.static(path.join(__dirname, 'public')));

// the order matters!
app.use('/admin',adminRoutes);
app.use(shopRoutes);

// all the unexisting routes will be handled by this middleware function
app.use('/', (req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
