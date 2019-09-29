var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');


router.use('/application',require('./application'));
router.use('/myApply',require('./myApply'));
router.get('/', function(req, res, next) { 
    res.render('index', { title: 'Express' });
});
  

module.exports = router;
