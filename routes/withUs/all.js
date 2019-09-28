var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');

// withUs/all
router.get('/',async(req,res)=>{
    let getWithUsAllResult;
    try{
        var connection = await pool.getConnection();
        let getWithUsAllQuery = 'SELECT * FROM withUs';
        getWithUsAllResult = await connection.query(getWithUsAllQuery);
        console.log(getWithUsAllResult);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getWithUsAllResult));
    }
});

// 스타트업분야, 직무 분류별로 보여주기!!
// withUs/all/getStartUpIdx
router.get('/getStartUpIdx/:startUp_idx',async(req,res)=>{
    let getStartUpResult;
    let {startUp_idx} = req.params;
    console.log(startUp_idx);

    try{
        var connection = await pool.getConnection();
        let getStartUpQuery = 'SELECT s.fieldName FROM withUs w,startUp s WHERE w.startUp_idx = s.startUp_idx AND w.startUp_idx = ?';
        getStartUpResult = await connection.query(getStartUpQuery,[startUp_idx]);
        console.log(getStartUpResult);
    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getStartUpResult));

    }
});




// 스타트업분야, 직무 분류별로 보여주기!!
// withUs/all/filterWithUsAll
router.get('/filterWithUs/:startUp_idx/:job_idx',async(req,res)=>{
    let getfilterWithUsAll;
    let {startUp_idx} = req.params;
    let {job_idx} = req.params;
    console.log(startUp_idx);
    console.log(job_idx);
    try{
        var connection = await pool.getConnection();
        let filterWithUsAllQuery = 'SELECT * FROM withUs WHERE startUp_idx = ? AND job_idx = ?';
        getfilterWithUsAll = await connection.query(filterWithUsAllQuery,[startUp_idx,job_idx]);
        console.log(getfilterWithUsAll);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.DB_ERROR,resMessage.ALL_LSIT_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.ALL_LIST_SUCCESS,getfilterWithUsAll));

    }
});

// 공고 정보
// withUs/all/detailAll
router.get('/detailAll/:withUs_idx',async(req,res)=>{
    let getDetailAllResult;
    let {withUs_idx} = req.params;
    try{
        var connection = await pool.getConnection();
        let getDetailAllQuery = 'SELECT * FROM withUs w, withUsDetail wd WHERE w.withUs_idx = wd.withUs_idx AND w.withUs_idx = ?';
        getDetailAllResult = await connection.query(getDetailAllQuery,[withUs_idx]);
        console.log(getDetailAllResult);

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
