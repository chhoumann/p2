/*
    ! We have very many pages currently, so I saw fit to move them here - for better structure.
*/

let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('test');
});

router.get('/profile', (req, res) => {
    res.render('profile');
});

router.get('/connect-with-friends', (req, res) => {
  res.render('connect-with-friends');
});

router.get('/movie-rec', (req, res) => {
    res.render('movie-rec');

});

router.get('/updateProfile', (req, res) => {
    res.render('updateProfile');

});

router.get('/createAccount', (req, res) => {
    res.render('createAccount');
});

module.exports = router;