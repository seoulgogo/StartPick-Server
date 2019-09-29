var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const crypto = require('crypto-promise');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
const moment = require('moment');
const upload = require('../../config/multer');
/* GET home page. */

upload.storage.temp="user/";
router.post('/', upload.single('img'), async(req,res)=>{
    
    let email = req.body.email;
    let salt = await crypto.randomBytes(32);
    salt = salt.toString('base64');
    let hasedPw = await crypto.pbkdf2(String(req.body.pw),salt,100,32,'SHA512');
    let basedPw = hasedPw.toString('base64');
    let name = req.body.name;
    let phone = req.body.phone;
    let birth = moment().format(req.body.birth,"YYYY-MM-DD");
    const img = req.file.location;
    let {job} = req.body;
    let {gender} = req.body;

    if(!email || !req.body.pw || !name || !phone || ! birth || !img || !job || !gender){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_MORE_PARAMS));
    }else{
        let insertUserQuery = "INSERT INTO mydb.user (email, pw, salt, name, phone, birth, img, job_idx, gender) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let insertUserResult;
        try{
            var connection = await pool.getConnection();
            await connection.commit();
            insertUserResult = await connection.query(insertUserQuery,[email, basedPw, salt, name, phone, birth, img, job, gender])||null;
            console.log(insertUserResult)
            var data = {
                user_idx : insertUserResult.insertId,
            }
        }catch(err){
            connection.rollback(()=>{});
            console.log(err);
            next(err);
        }finally{
            pool.releaseConnection(connection);
		if(insertUserResult==null){
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.SIGNUP_FAIL));
            }else{
                res.status(200).send(util.successTrue(statusCode.OK,resMessage.SIGNUP_SUCESS,data));
            }
        }

    } 

})
module.exports = router;
