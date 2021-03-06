const router = require('express').Router();
const {s3Multer} = require('../util/imgUploader');
const {Post} = require('../models/Post');

router.get('/', (req, res, next) => {
    if (req.query.address) next();
    Post.findAll({raw: true})
        .then((result) => {
            res.json(result)
        })
        .catch(next);
});

router.get('/', (req, res, next) => {
    const {address} = req.query;
    Post.findOne({where: {address}})
        .then(result => res.json(result))
        .catch(next);
});

router.post('/', s3Multer, (req, res, next) => {
    const {title, category, date, address, summary, text, lat, lng} = req.body;
    const img = req.files.map(e => e.location);
    Post.findOne({where: {address}})
        .then(post => {
            post.update({title, category, date, address, summary, text, img, lat, lng})
                .then(post => {
                    res.status(200);
                    res.end();
                }).catch(next)
        })
        .catch(() => {
            Post.create({title, category, date, address, summary, text, img, lat, lng})
                .then(post => {
                    res.status(200);
                    res.end();
                }).catch(next);
        })
});

router.delete('/', (req, res, next) => {
   const {address} = req.query;
   Post.destroy({where: {address}})
       .then(() => {
           res.status(200);
           res.end();
       }).catch(next);
});

module.exports = router;