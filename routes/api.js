const router = require('express').Router();
const {s3MulterSingle} = require('../util/imgUploader');
const {Post} = require('../models/Post');

router.get('/', (req, res, next) => {
    Post.findAll({raw: true})
        .then((result) => {
            // console.log(result);
            res.json(result)
        })
        .catch(next);
});

router.post('/', s3MulterSingle, (req, res, next) => {
    const {title, category, date, address, text} = req.body;
    const img = req.files.map(e => e.location);
    Post.create({title, category, date, address, text, img})
        .then(post => {
            // console.log(post);
            res.status(200);
            res.end();
        }).catch(next);
});

module.exports = router;