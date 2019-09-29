var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');

// 내가 좋아요한 함께해요 가져오기
// myPage/scrape/getScrapWithUs
router.get('/getScrapWithUs/:user_idx',async(req,res)=>{
    let getScrapWithUs;
    let {user_idx} = req.params;
    console.log(user_idx);

    try{
        var connection = await pool.getConnection();
        let getScrapWithUsQuery = 'SELECT * FROM withUs WHERE withUs_idx IN(SELECT wl.withUs_idx FROM withUs w, withUsLike wl WHERE w.withUs_idx = wl.withUs_idx AND wl.user_idx = ?)';
        getScrapWithUs = await connection.query(getScrapWithUsQuery,[user_idx]);
        console.log(getScrapWithUs);
    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getScrapWithUs));

    }
});

// 내가 좋아요한 지원사업 가져오기
// myPage/scrape/getScrapsupport
router.get('/getScrapsupport/:user_idx',async(req,res)=>{
    let getScrapsupport;
    let {user_idx} = req.params;
    console.log(user_idx);

    try{
        var connection = await pool.getConnection();
        let getScrapsupportQuery = 'SELECT * FROM business WHERE business_idx IN(SELECT b.business_idx FROM business b, businessLike bl WHERE b.business_idx = bl.business_idx AND bl.user_idx = ?)';
        getScrapsupport = await connection.query(getScrapsupportQuery,[user_idx]);
        console.log(getScrapsupport);
    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getScrapsupport));

    }
});







module.exports = router;
