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
    let {email} = req.body;
    const img = req.file.location;
    if(!email || !img){
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.NEED_MORE_PARAMS));
    }else{
        let getUserQuery = "UPDATE user SET img =? WHERE email= ?";
        let getUserResult;
        try{
            var connection = await pool.getConnection();
            await connection.commit();

            getUserResult = await connection.query(getUserQuery,[img, email]);
            pool.releaseConnection(connection);
		if(getUserResult==undefined){
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.FIND_NO_USER));
            }else{
                res.status(200).send(util.successTrue(statusCode.OK,resMessage.CHANGE_IMG )); 
            }
        }catch(err){
            connection.rollback(()=>{});
            console.log(err);
            next(err);
        }
    }

})
module.exports = router;
