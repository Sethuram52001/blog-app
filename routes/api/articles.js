const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');

router.get('/', (req, res) => {
    res.send("hello there from articles route")
})

module.exports = router;