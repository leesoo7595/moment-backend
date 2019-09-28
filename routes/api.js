const router = require('express').Router();
const {Post} = require('../models/Post');

router.get('/', (req, res, next) => {
    Post.findAll({raw: true})
        .then((result) => {
            console.log(result);
            res.json(result)
        })
        .catch(next);
});

module.exports = router;