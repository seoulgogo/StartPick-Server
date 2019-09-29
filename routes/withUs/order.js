var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');


// withUs/likeOrder
// 좋아요순
router.get('/likeOrder', async(req,res)=>{
    let getLikeOrder;
    try{
        var connection = await pool.getConnection();
        let getLikeOrderQuery = 'SELECT * FROM withUs ORDER BY likeNum DESC';
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
// 등록일순
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
