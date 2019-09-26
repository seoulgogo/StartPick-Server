var express = require('express');
var router = express.Router();
var pool = require('../../config/dbConfig');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const util = require('../../module/utils');
const upload = require('../../config/multer');

router.use('/all',require('./all'));
router.use('/like',require('./like'));
router.use('/apply',require('./apply'));
router.use('/order',require('./order'));

// 공고글 작성
// withUs/insertWithUs
upload.storage.temp="withUs/";
router.post('/insertWithUs', upload.single('img'), async(req,res)=>{
    let user_idx = req.body.user_idx;
    let startUp_idx = req.body.startUp_idx;
    let job_idx = req.body.job_idx;
    let detailJob = req.body.detailJob;
    let recrutNum = req.body.recrutNum;
    let salary = req.body.salary;
    let nego = req.body.nego;     // 협상가능
    let city_idx = req.body.city_idx    // 강남구, 강동구..
    let mainTask = req.body.mainTask;
    let intro = req.body.intro;
    const img = req.file.location;    // 공고 이미(썸네일)
    let companyName = req.body.companyName;
    let managerName = req.body.managerName;
    let managerPhone = req.body.managerPhone;
    let managerEmail = req.body.managerEmail;

    let insertWithUsQuery = 'INSERT INTO withUs(user_idx, startUp_idx, job_idx, detailJob, companyName, thumnail) VALUES(?,?,?,?,?,?);' + 'INSERT INTO withUsDetail(city_idx, recrutNum, salary, nego, mainTask, intro, managerName, managerPhone, managerEmail) VALUES(?,?,?,?,?,?,?,?,?);';
    let insertWithUsResult;
    try{
        var connection = await pool.getConnection();
        await connection.commit();
        insertWithUsResult = await connection.query(insertWithUsQuery,[user_idx, startUp_idx, job_idx, detailJob, companyName, img, city_idx, recrutNum, salary, nego, mainTask, intro, managerName, managerPhone, managerEmail]);

    }catch(err){
        console.log(err);
        connection.rollback(()=>{});
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.LIST_FAIL));
        next(err);
    }finally{
        pool.releaseConnection(connection);
        res.status(200).send(util.successTrue(statusCode.OK,resMessage.LIST_SUCCESS));
    }
});

// 공고글 수정
// withUs/modiyfyWithUs
upload.storage.temp="withUs/";
router.post('/modiyfyWithUs',upload.single('img'), async(req,res)=>{
    console.log(req.body);
    let withUs_idx = req.body.withUs_idx;
    let user_idx = req.body.user_idx;
    let job_idx = req.body.job_idx;
    let detailJob = req.body.detailJob;
    let recrutNum = req.body.recrutNum;
    let salary = req.body.salary;
    let nego = req.body.nego;     // 협상가능
    let city_idx = req.body.city_idx    // 강남구, 강동구..
    let mainTask = req.body.mainTask;
    let intro = req.body.intro;
    const img = req.file.location;    // 공고 이미(썸네일)
    let companyName = req.body.companyName;
    let managerName = req.body.managerName;
    let managerPhone = req.body.managerPhone;
    let managerEmail = req.body.managerEmail;

    let updateQuery  = 'UPDATE withUs SET job_idx=?, detailJob=?, companyName=?, thumnail=? WHERE withUs_idx = ? AND user_idx = ?;' + 'UPDATE withUsDetail SET city_idx=?, recrutNum=?, salary=?, nego=?, mainTask=?, intro=?, managerName=?, managerPhone=?, managerEmail=? WHERE withUs_idx = ?;';
    let updateResult;
        try{
            var connetion = await pool.getConnection();
            updateResult = await connetion.query(updateQuery, [job_idx, detailJob,companyName,img, withUs_idx, user_idx, city_idx, recrutNum, salary, nego, mainTask, intro, managerName, managerPhone, managerEmail, withUs_idx]);
            console.log(updateResult);
        }catch(err){
            console.log(err);
            connection.rollback(()=>{});
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST,resMessage.LIST_FAIL));
            next(err);
        }finally{
            pool.releaseConnection(connection);
            res.status(200).send(util.successTrue(statusCode.OK,resMessage.LIST_SUCCESS));
        }
});



module.exports = router;
