const express = require('express');
const path = require('path');

// Import routers
const router = require('./router/router.js');

// Create app
const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

// Set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set assets
app.use(express.static(path.join(__dirname, 'public')));

// Delegate handling to router.js
app.use('/', router);

// Listening...
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`Your app is listening on port: ${listener.address().port}`);
})