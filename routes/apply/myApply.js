
var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage'); 
const util = require('../../module/utils');
/* GET home page. */

var startUP = ["IT","여행","교육","금융","보안","교통","건설","게임","부동산","친환경","헬스케어",
    "사회봉사","자연과학","전자제품","물류/유통","광고/마케팅","농/축/수산업","엔터테인먼트","바이오/의료","기타"]
router.get('/:email', async(req,res,next)=>{
    let {email} = req.params;
    if(!email){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_EMAIL));
    }else{
        let getUserIdxQuery ="SELECT * FROM mydb.user WHERE email=?";
        let getUserIdx;
        try{
            var connection = await pool.getConnection();
            await connection.beginTransaction();

            getUserIdx = await connection.query(getUserIdxQuery,[email]);
            if(getUserIdx==undefined){
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.FIND_NO_USER));
            }else{
                let userIdx = getUserIdx[0].idx;
                let getUserWithUsApply = "SELECT * FROM mydb.withUsApply WHERE user_idx =?";
                let getUserWithUsResult = await connection.query(getUserWithUsApply,[userIdx]);
                let tempData = new Array();
                if(getUserWithUsResult == undefined){
                    res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.FIND_NO_WITHUS));
                }else{
                    for(idx in getUserWithUsResult){
                        let getWithUsIdx = getUserWithUsResult[idx].withUs_idx;
                        let getWithUs = "SELECT * FROM mydb.withUs WHERE withUs_idx =?";
                        let getWithUsResult = await connection.query(getWithUs,[getWithUsIdx]);
                        let data = {
                            detailJob : getWithUsResult[0].detailJob,
                            companyName : getWithUsResult[0].companyName,
                            startUpCategory : startUP[getWithUsResult[0].startUp_idx-1],
                            thumnail:getWithUsResult[0].thumnail,
                        }
                        console.log(data);
                        tempData.push(data);
                    }
                    let resData ={
                        email : email,
                        withUsList : tempData,
                    }
			pool.releaseConnection(connection);
                    res.status(200).send(util.successTrue(statusCode.OK,resMessage.FIND_OK_WITHUS,resData));

                    
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
