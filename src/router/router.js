const express = require('express');
const multer = require('multer');

// Create Router
const router = express.Router();

// Declare object for upload file from form
const upload = multer({ dest: 'uploads/' });
const uploadFile = upload.fields([{ name: 'svg', maxCount: 1 }]);

router.get('/create-nft', (req, res) => {
    res.render('index');
});

module.exports = router;