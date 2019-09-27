var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');

// /supportList/all
router.get('/',async(req,res)=>{
    let getAllListResult;
    try{
        var connection = await pool.getConnection();
        let getAllListQuery = 'SELECT * FROM business';
        getAllListResult = await connection.query(getAllListQuery);
        console.log(getAllListResult);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getAllListResult));

    }
});

// 장르별 지원사업
// /supportList/all/typeAll
router.get('/typeAll/:bsCategory_idx',async(req,res)=>{
    let getTypeAllListResult;
    let {bsCategory_idx} = req.params;
    console.log(bsCategory_idx);
    try{
        var connection = await pool.getConnection();
        let getTypeAllListQuery = 'select * from business where bsCategory_idx = ?';
        getTypeAllListResult = await connection.query(getTypeAllListQuery,[bsCategory_idx]);
        console.log(getTypeAllListResult);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getTypeAllListResult));

    }
});

// /supportList/all/detailAll
router.get('/detailAll/:business_idx',async(req,res)=>{
    let getDetailAllQuery;
    let {business_idx} = req.params;
    try{
        var connection = await pool.getConnection();
        let getDetailAllQuery = 'select * from business b, businessDetail bd where b.business_idx = bd.business_idx and b.business_idx = ?';
        getDetailAllResult = await connection.query(getDetailAllQuery,[business_idx]);
        console.log(getDetailAllQuery);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getDetailAllResult));

    }
});

module.exports = router;
