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
            if(getResumeReuslt!=false){
                console.log(getResumeReuslt);
                let bodyJson = JSON.parse(JSON.stringify(req.body));
                let phone = (bodyJson.hasOwnProperty('phone')==true?bodyJson.phone:getResumeReuslt[0].phone);
                let major = (bodyJson.hasOwnProperty('major')==true?req.body.major:getResumeReuslt[0].major);
                let intro = (bodyJson.hasOwnProperty('intro')==true?req.body.intro:getResumeReuslt[0].intro);
                let updatDate = moment().format('YYYY-MM-DD hh:ss');
                console.log(req.body.link);
                let link = (bodyJson.hasOwnProperty('link')==true?req.body.link: getResumeReuslt[0].link);
                let newName = (bodyJson.hasOwnProperty('name')==true?req.body.newName: getResumeReuslt[0].name);
                
                let updateResumeQuery = "update mydb.resume set phone=?, major=?, intro=?, updatDate=?, link =?, name=? where name=?";
                let updateResumeResult = await connection.query(updateResumeQuery,[phone, major, intro, updatDate, link, newName ,name]);
                console.log(updateResumeResult);
                await connection.commit();
                pool.releaseConnection(connection);
		    if(updateResumeResult==true){
                    res.status(200).send(util.successTrue(statusCode.OK,resMessage.UPDATE_SUCESS));
                }else{
                    res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.UPDATE_FAILE));
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
