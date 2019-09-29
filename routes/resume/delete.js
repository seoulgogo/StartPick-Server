var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
const moment = require('moment');
/* GET home page. */

router.get('/', async(req,res,next)=>{
   let {name} = req.query;
   console.log(name);
   if(!name){
    res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_RESUMENAME));
   }else{
        let getResumeQuery = "DELETE FROM mydb.resume WHERE name = ?";
        var connection = await pool.getConnection();
        await connection.commit();
        try{
            let getResumeResult = await connection.query(getResumeQuery,[name]);
            pool.releaseConnection(connection);
		if(getResumeResult== undefined){
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.FIND_NO_RESUME));
            }else{
                
                res.status(200).send(util.successTrue(statusCode.OK,resMessage.DLETE_OK));
            }

        }catch(err){
            connection.rollback(()=>{});
            console.log(err);
            next(err);
        }
   }

})
module.exports = router;
