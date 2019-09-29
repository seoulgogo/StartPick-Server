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
    console.log(req.body);
    let {email} = req.body;
    let {phone} = req.body;
    let {name} = req.body;
    let {major} = req.body;
    let {career} = req.body;
    let {activity}= req.body;
    let {intro} = req.body;
    let {link} = req.body;
    


    if(!email ||!name ){
        console.log(email)
        console.log(name);
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_MORE_PARAMS));
    }else{
        try{
            var connection = await pool.getConnection();
            await connection.beginTransaction();

            let getUserIdxQuery = "select * from mydb.user where email=?";
            let getUserIdxResult = await connection.query(getUserIdxQuery,email);
            let userIdx = getUserIdxResult[0].idx;
            let username = getUserIdxResult[0].name;
            await connection.commit();
            console.log(userIdx);

            let insertResumeQuery = "INSERT INTO mydb.resume (user_idx, phone, major, intro, link, updatDate,name) VALUE (?,?,?,?,?,?,?);";
            let insertResumeResult = await connection.query(insertResumeQuery,[userIdx, phone,major, intro, link, moment().format('YYYY-MM-DD hh:ss'),name]);
            await connection.commit();
            console.log(insertResumeResult)
            let resume_idx = insertResumeResult.insertId;
            
            if(career){
                for(idx in career){
                    let startDate =  new Date(career[idx].startYear, career[idx].startMonth-1);
                    let endDate = new Date(career[idx].endYear, career[idx].endMonth);
                    let insertCareerQuery = "INSERT INTO mydb.career (resume_idx, companyName, startDate, endDate,content) VALUES(?,?,?,?,?)";
                    let insertCareerResult = await connection.query(insertCareerQuery,[resume_idx, career[idx].companyName,startDate, endDate, career[idx].content]);
                    console.log(insertCareerResult);
                    await connection.commit();
                    
                }
            }
            if(activity){
                for(idx in activity){
                    let startDate =  new Date(activity[idx].startYear, activity[idx].startMonth-1);
                    let endDate = new Date(activity[idx].endYear, activity[idx].endMonth);
                    let insertActivityQuery = "INSERT INTO mydb.activity (resume_idx, activityName, startDate, endDate,content) VALUES(?,?,?,?,?)";
                    let insertActivityResult = await connection.query(insertActivityQuery,[resume_idx, activity[idx].activityName,startDate, endDate, activity[idx].content]);
                    console.log(insertActivityResult);
                    await connection.commit();
                }
            }
		pool.releaseConnection(connection);
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.RESUME_SUCESS));
        }catch(err){
            connection.rollback(()=>{});
            console.log(err);
            next(err);
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.RESUME_FAIL));
        }
    }
    

})
module.exports = router;
