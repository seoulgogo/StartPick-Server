var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');

var seoulCity=["강남구","강동구", "강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구",
    "서대문구", "서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"]

router.get('/:city',async(req,res)=>{
    let {city} = req.params;
    console.log(city);
    try{
        let selectCityMapQuery = "SELECT * from mydb.map where city=?";
        let selectCityMapResult;
        var connection = await pool.getConnection();
        await connection.commit();
        
        selectCityMapResult = await connection.query(selectCityMapQuery,[city])||null;
        if(!selectCityMapResult){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.MAP_DATA_NO));
        }else{
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.DATA_SUCESS,selectCityMapResult))
        }
    }catch(err){
        connection.rollback(()=>{});
            console.log(err);
            next(err);
    }
});

module.exports = router;
