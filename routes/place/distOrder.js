var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');



router.post('/',async(req,res)=>{
    let {la} = req.body;
    let {lo} = req.body;

    try{
        let selectAllMapQuery = "SELECT * from mydb.map";
        let selectAllMapResult;
        var connection = await pool.getConnection();
        await connection.commit();
        
        selectAllMapResult = await connection.query(selectAllMapQuery)||null;
        if(!selectAllMapResult){
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.MAP_DATA_NO));
        }else{     
            for( idx in selectAllMapResult){
                let distX = Math.abs(selectAllMapResult[idx].latitude);
                let distY = Math.abs(selectAllMapResult[idx].longitude);
                selectAllMapResult[idx].dist = Math.sqrt(distX*distX+distY*distY);
            }
            selectAllMapResult.sort(function(a,b){
                return a.dist < b.dist ? -1 : a.dist > b.dist ? 1:0;
            });
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.MAP_DIST_SUCESS,selectAllMapResult))
        }

        
    }catch(err){
        connection.rollback(()=>{});
            console.log(err);
            next(err);
    }
});

module.exports = router;
