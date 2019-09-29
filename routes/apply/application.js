
var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage'); 
const util = require('../../module/utils');
/* GET home page. */
router.get('/:email', async(req,res)=>{
    let {email}= req.params;
    if(!email){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_RESUMENAME));
    }else{
        let getUserIdxQuery = "SELECT * FROM mydb.user WHERE email =?";
        let getUserIdxResult;
        try{
            var connection = await pool.getConnection();
            await connection.beginTransaction();

            getUserIdxResult = await connection.query(getUserIdxQuery,[email]);
            console.log(getUserIdxResult)
            if(getUserIdxResult==undefined){
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.FIND_NO_USER));
            }else{
                let userIdx = getUserIdxResult[0].idx;
                let getWithUsQuery = "SELECT * FROM mydb.withUs WHERE user_idx=?";
                //user가 올린 공고
                let getWithUsResult = await connection.query(getWithUsQuery,[userIdx]);
                console.log(getWithUsResult)
                var resume=new Array();
                if(getWithUsResult==undefined){
                    res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.EMPTY_WITHUS));
                }else{
                    for(withUsIdx in getWithUsResult){
                        let getApplyUsersQuery = "SELECT * FROM mydb.withUsApply WHERE withUs_idx=?";
                        let getApplyUsersResult = await connection.query(getApplyUsersQuery,[getWithUsResult[withUsIdx].withUs_idx]);
                        console.log(getApplyUsersResult);
                        for(idx in getApplyUsersResult){
                            console.log(getApplyUsersResult[idx]);
                            let getResumeQuery = "SELECT * FROM mydb.resume WHERE idx = ?";
                            let getResumeResult = await connection.query(getResumeQuery,[getApplyUsersResult[idx].resume_idx]);
                            let getUserQuery = "SELECT * FROM mydb.user WHERE idx= ?"
                            let getUserResult = await connection.query(getUserQuery,[getApplyUsersResult[idx].user_idx]);
                            let tempDate ={
                                jobIdx : getWithUsResult[withUsIdx].job_idx,
                                companyName : getWithUsResult[withUsIdx].companyName,
                                withUsName : getWithUsResult[withUsIdx].detailJob,
                                resumeName : getResumeResult[0].name,
                                userName : getUserResult[0].name,
                                img : getUserResult[0].img,
                            }
                            console.log(tempDate);
                            resume.push(tempDate);
                        }
                    }

			pool.releaseConnection(connection);
                    res.status(200).send(util.successTrue(statusCode.OK,resMessage.READ_SUCCESS, resume));
                }
            }

        }catch(err){
            connection.rollback(()=>{});
            console.log(err);
            next(err);
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.FIND_NO_USER));
        }
    }
})
module.exports = router;
