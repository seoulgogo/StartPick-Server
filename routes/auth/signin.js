
var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
/* GET home page. */
router.post('/', async(req,res)=>{
    let {email} = req.body;
    let {pw} = req.body;
    if(!email || !pw){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_MORE_PARAMS));
    }else{
        let selectUserQuery ="SELECT * FROM mydb.user WHERE email =?";
        let selectUserResultl
        try{
            var connection = await pool.getConnection();
            await connection.commit();
            selectUserResult = await connection.query(selectUserQuery, [email])||null;
            
            if(!selectUserResult){
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NO_USER));
            }else{
                let salt = selectUserResult[0].salt;
                let resultPw = selectUserResult[0].pw;

                let hasedPw = await crypto.pbkdf2(pw, salt, 100,32, 'SHA512');
                let basedPw = hasedPw.toString('base64');
                console.log(resultPw);
                console.log(basedPw);
                if(basedPw == resultPw){
                    res.status(200).send(util.successTrue(statusCode.OK,resMessage.LOGIN_SUCESS));
                }else{
                    res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.PW_WRONG));
                }
            }

        }catch(err){
            connection.rollback(()=>{});
            console.log(err);
            next(err);
        }
    }
    // DB에 넣기만 하면댐
    
})
module.exports = router;
