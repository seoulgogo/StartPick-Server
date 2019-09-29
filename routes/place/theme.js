var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');

router.get('/',async(req,res)=>{
    let {category} = req.query;
    console.log(category)
    try{
        let selectCityMapQuery = "SELECT * from mydb.map where theme=?";
        let selectCityMapResult;
        var connection = await pool.getConnection();
        await connection.commit();
        
        selectCityMapResult = await connection.query(selectCityMapQuery,[category])||null;
        pool.releaseConnection(connection);
	    if(selectCityMapResult==undefined){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.MAP_DATA_NO));
        }else{
            console.log(selectCityMapResult)
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.DATA_SUCESS,selectCityMapResult))
        }
    }catch(err){
        connection.rollback(()=>{});
            console.log(err);
            next(err);
    }
});

module.exports = router;
