
var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
/* GET home page. */

var jobDuty =["개발","기획","디자인","마케팅","미디어","영업","기타"];

router.get('/:email',async(req,res)=>{
    let {email} = req.params;
    try{
        let selectUserInfoQuery = "SELECT * from mydb.user where email = ?";
        let selectUserInfoResult;
        var connection = await pool.getConnection();
        await connection.commit();
        
        selectUserInfoResult = await connection.query(selectUserInfoQuery,[email])||null;
        console.log(selectUserInfoResult[0]==undefined)
        if(selectUserInfoResult[0]==undefined){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NO_USER));
        }else{
            console.log(selectUserInfoResult[0])
            let resDtae ={
                name : selectUserInfoResult[0].name,
                job : jobDuty[selectUserInfoResult[0].job_idx -1],
                email : selectUserInfoResult[0].email,
                img : selectUserInfoResult[0].img || null,
            }
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.DATA_SUCESS,resDtae));
        }
    }catch(err){
        connection.rollback(()=>{});
            console.log(err);
            next(err);
    }
});

module.exports = router;
