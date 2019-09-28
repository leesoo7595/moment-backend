const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;