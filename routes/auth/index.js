var express = require('express');
var router = express.Router();

/* GET home page. */

router.use('/signin',require('./signin'));
router.use('/signup',require('./signup'));
router.use('/changeImg',require('./changeImg'));
router.get('/', function(req, res, next) {
  console.log("hihihi");
  res.render('index', { title: 'Express' });
});

module.exports = router;
