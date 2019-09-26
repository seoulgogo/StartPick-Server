var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');


// supportList/endorder
// 마감 날짜 순
router.get('/endOrder',async(req,res)=>{
    let getEndOrder;
    try{
        var connection = await pool.getConnection();
        let getEndOrderQuery = 'select * from business order by endDate';
        getEndOrder = await connection.query(getEndOrderQuery);
        console.log(getEndOrder);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getEndOrder));

    }
});

// supportList/enrollOrder
// 등록일순
router.get('/enrollOrder',async(req,res)=>{
    let getEnrollOrder;
    try{
        var connection = await pool.getConnection();
        let getEnrollOrderQuery = 'select * from business order by enrollDate';
        getEnrollOrder = await connection.query(getEnrollOrderQuery);
        console.log(getEnrollOrder);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getEnrollOrder));
    }
});

// supportList/startorder
// 신청날짜순
router.get('/startOrder',async(req,res)=>{
    let getStartOrder;
    try{
        var connection = await pool.getConnection();
        let getStartOrderQuery = 'select * from business order by startDate';
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
