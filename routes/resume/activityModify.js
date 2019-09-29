var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
const moment = require('moment');
/* GET home page. */

router.post('/', async(req,res)=>{
    //이력서 이름하고 companyName 필수
    let {name} = req.body;
    
    if(!name){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_RESUMENAME));
    }else{
        let getResumeQuery = "SELECT * FROM mydb.resume WHERE name=?";
        let getResumeReuslt;
        try{
            var connection = await pool.getConnection();
            await connection.beginTransaction();

            getResumeReuslt = await connection.query(getResumeQuery,[name]);
            console.log(getResumeReuslt);
            if(getResumeReuslt==false){
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.FIND_NO_RESUME));
            }else{

                let resumeIdx = getResumeReuslt[0].idx;
                let activityName = req.body.activityName;

                let findActivityQuery = "SELECT * FROM mydb.activity WHERE activityName=? and resume_idx=?"
                let findActivityResult = await connection.query(findActivityQuery,[activityName, resumeIdx]);
                console.log(findActivityResult[0]);
                if(findActivityResult==false){
                    res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.FIND_NO_ACTIVITY));
                }else{
                    let startDate=null;
                    let endDate=null;
                    let bodyJson = JSON.parse(JSON.stringify(req.body));
                    if(bodyJson.hasOwnProperty('startYear') || bodyJson.hasOwnProperty('startMonth')){
                        startDate =  new Date(bodyJson.startYear, bodyJson.startMonth-1);
                    }else{
                        startDate = findActivityResult[0].startDate;
                    }
                    if(bodyJson.hasOwnProperty('endYear') || bodyJson.hasOwnProperty('endMonth')){
                        endDate =  new Date(bodyJson.endYear, bodyJson.endMonth-1);
                    }else{
                        endDate = findActivityResult[0].endDate;
                    }
                    console.log(startDate);
                    console.log(endDate);
                    let content = (bodyJson.hasOwnProperty('content')==true?bodyJson.content:getResumeReuslt[0].content);
                    console.log(getResumeReuslt)
                    let newActivityName = (bodyJson.hasOwnProperty('newActivityName')==true?bodyJson.newActivityName:activityName);

                    let updateActivityQuery = "update mydb.activity set activityName=?, startDate=?, endDate=?, content=? where activityName=? and resume_idx=?";
                    let updateActivityResult = await connection.query(updateActivityQuery,[newActivityName, startDate, endDate, content, activityName,resumeIdx]);
                    await connection.commit();
                    console.log(updateActivityResult!=undefined);
                    console.log(updateActivityResult[0]==false);
                   pool.releaseConnection(connection); 
                    if(updateActivityResult!=undefined){
                        console.log(updateActivityResult)
                        res.status(200).send(util.successTrue(statusCode.OK,resMessage.UPDATE_SUCESS));
                    }else{
                        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.UPDATE_FAILE));
                    }
                }
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
