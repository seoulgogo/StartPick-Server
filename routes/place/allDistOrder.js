var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');


router.get('/',async(req,res)=>{
    //위도
    let {la} = req.query;
    //경도
    let {lo} = req.query;

});

module.exports = router;
