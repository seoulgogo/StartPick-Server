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
                let companyName = req.body.companyName;

                let findCareerQuery = "SELECT * FROM mydb.career WHERE companyName=? and resume_idx=?"
                let findCareerResult = await connection.query(findCareerQuery,[companyName, resumeIdx]);
                console.log(findCareerResult[0]);
                if(findCareerResult==false){
                    res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.FIND_NO_CAREER));
                }else{
                    let startDate=null;
                    let endDate=null;
                    let bodyJson = JSON.parse(JSON.stringify(req.body));
                    if(bodyJson.hasOwnProperty('startYear') || bodyJson.hasOwnProperty('startMonth')){
                        startDate =  new Date(bodyJson.startYear, bodyJson.startMonth-1);
                    }else{
                        startDate = findCareerResult[0].startDate;
                    }
                    if(bodyJson.hasOwnProperty('endYear') || bodyJson.hasOwnProperty('endMonth')){
                        endDate =  new Date(bodyJson.endYear, bodyJson.endMonth-1);
                    }else{
                        endDate = findCareerResult[0].endDate;
                    }
                    console.log(startDate);
                    console.log(endDate);
                    let content = (bodyJson.hasOwnProperty('content')==true?bodyJson.content:getResumeReuslt[0].content);
                    let newCompanyName = (bodyJson.hasOwnProperty('newCompanyName')==true?bodyJson.newCompanyName:companyName);


                    let updateCareerQuery = "update mydb.career set companyName=?, startDate=?, endDate=?, content=? where companyName=? and resume_idx=?";
                    let updateCareerResult = await connection.query(updateCareerQuery,[newCompanyName, startDate, endDate, content, companyName,resumeIdx]);
                    await connection.commit();
                    console.log(updateCareerResult!=undefined);
                    console.log(updateCareerResult[0]==false);
                   pool.releaseConnection(connection); 
                    if(updateCareerResult!=undefined){
                        console.log(updateCareerResult)
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
