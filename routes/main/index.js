var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
const upload = require('../../config/multer');

// main/bannerOrder
// 최신 공고, 배너
router.get('/bannerOrder',async(req,res)=>{
    let getStartOrder;
    try{
        var connection = await pool.getConnection();
        let getStartOrderQuery = 'SELECT * FROM withUs WHERE date = (SELECT MAX(date) FROM withUs)';
        getStartOrder = await connection.query(getStartOrderQuery);
        console.log(getStartOrder);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getStartOrder));
    }
});

// 맞춤형 공고 - 관련직무 중 좋아요 순
router.get('/CustomizeOrder/:job_idx', async(req,res)=>{
    let getCustomizeOrder;
    let {job_idx} = req.params;
    try{
        var connection = await pool.getConnection();
        let getCustomizeOrderQuery = 'SELECT * FROM withUs WHERE job_idx = ? ORDER BY likeNum DESC limit 3';
        getCustomizeOrder = await connection.query(getCustomizeOrderQuery,[job_idx]);
        console.log(getCustomizeOrder);
    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getCustomizeOrder));
    }
});


// main/likeOrder
// 좋아요순
router.get('/likeOrder', async(req,res)=>{
    let getLikeOrder;
    try{
        var connection = await pool.getConnection();
        let getLikeOrderQuery = 'SELECT * FROM withUs ORDER BY likeNum DESC limit 3';
        getLikeOrder = await connection.query(getLikeOrderQuery);
        console.log(getLikeOrder);
    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getLikeOrder));
    }
});

// withUs/newOrder
// 등록일순 - 3개씩
router.get('/newOrder',async(req,res)=>{
    let getStartOrder;
    try{
        var connection = await pool.getConnection();
        let getStartOrderQuery = 'SELECT * FROM withUs ORDER BY date DESC limit 3';
        getStartOrder = await connection.query(getStartOrderQuery);
        console.log(getStartOrder);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getStartOrder));
    }
});












module.exports = router;
