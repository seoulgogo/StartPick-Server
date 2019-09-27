var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');

// 지원하기 (user_idx, resume, )
// withUs/apply/insertApply
router.post('/insertApply',async(req,res)=>{
    let user_idx = req.body.user_idx;
    let withUs_idx = req.body.withUs_idx;

    console.log(withUs_idx);
    console.log(user_idx);
    if(!user_idx || !withUs_idx){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.EMPTY_LIST));
    }else{
        let insertApplyQuery = 'INSERT into withUsApply(user_idx, withUs_idx) VALUES(?,?)';
        let insertApplyResult;
        try{
            var connection = await pool.getConnection();
            insertApplyResult = await connection.query(insertApplyQuery,[user_idx, withUs_idx]);
            console.log(insertApplyResult);
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
