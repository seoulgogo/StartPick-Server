var express = require('express');
var router = express.Router();

/* GET home page. */

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//  지원사업
router.use('/supportList',require('./supportList/index'));
router.use('/auth',require('./auth/index'));
router.use('/place',require('./place/index'));
router.use('/withUs',require('./withUs/index'));
//router.use('/main',require('./main/index'));
router.get('/', function(req, res, next) {
  console.log("hihihi");
  res.render('index', { title: 'Express' });

});

module.exports = router;
