var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');


// withUs/like/insertLikeWithUs
router.post('/insertLikeWithUs',async(req,res)=>{
    let user_idx = req.body.user_idx;
    let withUs_idx = req.body.withUs_idx;
    console.log(user_idx);
    console.log(withUs_idx);

    if(!user_idx || !withUs_idx){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.EMPTY_LIST));
    }else{
        let insertLikeWithUsQuery = 'INSERT into withUsLike(user_idx, withUs_idx) VALUES(?,?)';
        let insertLikeWithUsResult;
        try{
            var connection = await pool.getConnection();
            insertLikeWithUsResult = await connection.query(insertLikeWithUsQuery,[user_idx, withUs_idx]);
            console.log(insertLikeWithUsResult);
        }catch(err){
            console.log(err);
            connection.rollback(()=>{});
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.LIST_FAIL));
            next(err);
        }finally{
            pool.releaseConnection(connection);
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.LIST_SUCCESS));
        }
    }
});

// withUs/like/plusWithUsLikeNum
router.post('/plusWithUsLikeNum',async(req,res)=>{
    console.log(req.body);
    let withUs_idx  = req.body.withUs_idx;

    if(!withUs_idx){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.EMPTY_LIST));
    }else{
      let updateQuery  ='UPDATE withUs SET likeNum = likeNum	+ 1 WHERE withUs_idx = ?';
      let updateResult;
        try{
            var connetion = await pool.getConnection();
            updateResult = await connetion.query(updateQuery,[withUs_idx]);
            console.log(updateResult);
        }catch(err){
          console.log(err);
          connection.rollback(()=>{});
          res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.LIST_FAIL));
          next(err);
        }finally{
          pool.releaseConnection(connection);
          res.status(200).send(util.successTrue(statusCode.OK,resMessage.LIST_SUCCESS))
        }
      }
});









module.exports = router;
