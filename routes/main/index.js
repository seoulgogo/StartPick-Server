var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
const upload = require('../../config/multer');

// main/newOrder
// 최신 공고
router.get('/newOrder',async(req,res)=>{
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
router.get('/CustomizeOrder', async(req,res)=>{
    let getCustomizeOrder;
    let job_idx = req.body.job_idx;
    try{
        var connection = await pool.getConnection();
        let getCustomizeOrderQuery = 'SELECT * FROM withUs WHERE job_idx = ? ORDER BY likeNum DESC limit 5';
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

// withUs/newOrder
// 등록일순 - 5개씩
router.get('/newOrder',async(req,res)=>{
    let getStartOrder;
    try{
        var connection = await pool.getConnection();
        let getStartOrderQuery = 'SELECT * FROM withUs ORDER BY date DESC';
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
