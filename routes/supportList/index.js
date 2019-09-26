var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');

router.use('/all',require('./all'));
router.use('/order',require('./order'));

// supportList/likeSupport
router.post('/insertLike',async(req,res)=>{
    let user_idx = req.body.user_idx;
    let business_idx = req.body.business_idx;
    console.log(user_idx);
    console.log(business_idx);

    if(!user_idx || !business_idx){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.EMPTY_LIST));
    }else{
        let insertListQuery = 'INSERT into businessLike(user_idx, business_idx) VALUES(?,?)';
        let insertLikeBusResult;
        try{
            var connection = await pool.getConnection();
            insertLikeBusResult = await connection.query(insertListQuery,[user_idx, business_idx]);
            console.log(insertLikeBusResult);
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
})


module.exports = router;
