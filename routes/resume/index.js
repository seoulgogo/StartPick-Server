var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');



router.use('/create',require('./create'));
router.use('/modify',require('./modify'));
router.use('/careerModify',require('./careerModify'));
router.use('/activityModify',require('./activityModify'));
router.use('/showResume',require('./showResume'));
router.use('/showAllResume',require('./showAllResume'));
router.use('/delete',require('./delete'));
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
  

module.exports = router;
