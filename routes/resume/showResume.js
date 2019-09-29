var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
const moment = require('moment');
/* GET home page. */

router.get('/:resumeName', async(req,res)=>{
    let {resumeName} = req.params;

    if(!resumeName){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_MORE_PARAMS));
    }else{
        let selectResumeQuery = "select * from mydb.resume where name = ?";
        let selectResumeResult;
        let resData;
        try{
            var connection = await pool.getConnection();
            await connection.beginTransaction();

            selectResumeResult = await connection.query(selectResumeQuery,[resumeName]);
            console.log(selectResumeResult==true);
            console.log(selectResumeResult==undefined);
            console.log(selectResumeResult!=undefined);
            if(selectResumeResult!=undefined){
                resData = selectResumeResult[0]
                let resumeIdx = selectResumeResult[0].idx;
                let selectCareerQuery = "select * from mydb.career where resume_idx=?";
                let selectCaeerResult = await connection.query(selectCareerQuery,[resumeIdx]);
                let career = new Array();
                for(idx in selectCaeerResult){
                    selectCaeerResult[idx].startDate = moment(selectCaeerResult[idx].startDate).format('YYYY-MM-DD');
                    selectCaeerResult[idx].endDate = moment(selectCaeerResult[idx].endDate).format('YYYY-MM-DD');
                    career.push(selectCaeerResult[idx]);
                    
                }
                resData.career = career;
                let selectActivityQuery = "select * from mydb.activity where resume_idx=?";
                let selectActivtyResult = await connection.query(selectActivityQuery,[resumeIdx]);
                let activity = new Array();
                for(idx in selectActivtyResult){
                    selectActivtyResult[idx].startDate = moment(selectActivtyResult[idx].startDate).format('YYYY-MM-DD');
                    selectActivtyResult[idx].endDate = moment(selectActivtyResult[idx].endDate).format('YYYY-MM-DD');
                    activity.push(selectActivtyResult[idx]);
                }
                resData.activity = activity;
                console.log(resData);
                pool.releaseConnection(connection);
		    res.status(200).send(util.successTrue(statusCode.OK, resMessage.FIND_OK_RESUME,resData));
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
