var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');

router.use('/all',require('./all'));
router.use('/area',require('./area'));
router.use('/distOrder',require('./distOrder'));

router.use('/area',require('./area'));

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
  

module.exports = router;
