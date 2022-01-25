const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/create-nft', (req, res) => {
    res.render('create-nft');
})

router.get('/my-nft', (req, res) => {
    res.render('my-nft', {
        created: (req.query.action && req.query.action == 'created') ? true : false,
        error: (req.query.action && req.query.action == 'error') ? true : false
    })
})

module.exports = router;