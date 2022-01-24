const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/create-nft', (req, res) => {
    res.render('create-nft');
})

module.exports = router;