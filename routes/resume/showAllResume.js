var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
const moment = require('moment');
/* GET home page. */

router.get('/:email', async(req,res)=>{
    let {email} = req.params;

    if(!email){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_MORE_PARAMS));
    }else{
        let selectUserIdxQuery = "select * from mydb.user where email = ?";
        let selectUserIdxResult;
        let resData;
        try{
            var connection = await pool.getConnection();
            await connection.beginTransaction();

            selectUserIdxResult = await connection.query(selectUserIdxQuery,[email]);
            console.log(selectUserIdxResult);
            console.log(selectUserIdxResult==undefined);
            console.log(selectUserIdxResult!=undefined);
            var resumeAll = new Array();
            if(selectUserIdxResult!=undefined){
                let selectUserResumeQuery="select * from mydb.resume WHERE user_idx = ?";
                let selectUserResumeResult = await connection.query(selectUserResumeQuery,[selectUserIdxResult[0].idx]);

                let resData={
                    email : email,
                    resume: selectUserResumeResult
                }
		    pool.releaseConnection(connection);
                res.status(200).send(util.successTrue(statusCode.OK,resMessage.FIND_OK_RESUME,resData));
            }else{
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.FIND_NO_RESUME));
            }

        }catch(err){
            connection.rollback(()=>{});
            console.log(err);
            next(err);
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.RESUME_FAIL));
        }
    }
    

})
module.exports = router;
