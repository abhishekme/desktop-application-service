'use strict'

//Get ORM object
var patientController       = require('./patient');
var constants               = require('../../config/constants');
const { body,validationResult,check } = require('express-validator');
const Sequelize             = require('sequelize'); 
const Op                    = Sequelize.Op;
const db                    = require('../models');
const theModel              = db.patient; 
const theController         = patientController;
const variableDefined       = constants[0].application;
const env = process.env.NODE_ENV || 'development';

//console.log("Model: ", db, " ::LoginModel: ", theLoginModel);
//return;

//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------
exports.validate = (method) => {
  switch (method) {
    case 'create' : {
     return [ 
        body('pt_name', variableDefined.variables.pt_name).exists(),
        body('pt_addr', variableDefined.variables.pt_addr).exists(),
        body('pt_case_date', variableDefined.variables.pt_case_date).exists(),
        body('pt_mobile', variableDefined.variables.mobile_required)
         .exists()
         .isLength({ min: 10 })
         .withMessage(variableDefined.variables.mobile_strength)
         .isNumeric()
         .withMessage(variableDefined.variables.mobile_strength_step2),
       ]   
    }
    
    case 'update' : {
      return [ 
        body('pt_name', variableDefined.variables.pt_name).exists(),
        body('pt_addr', variableDefined.variables.pt_addr).exists(),
        body('pt_case_date', variableDefined.variables.pt_case_date).exists(),
        body('pt_mobile', variableDefined.variables.mobile_required)
         .exists()
         .isLength({ min: 10 })
         .withMessage(variableDefined.variables.mobile_strength)
         .isNumeric()
         .withMessage(variableDefined.variables.mobile_strength_step2),      
        ]   
     }
  }
}

exports.apiValidation   = function(req,resp){
  //console.log("Enter...bod: ", req.body);
  const errors          = validationResult(req);
  var validationErr     = [];
  var validationErrMesg = [];

  //console.log("@Valid Errorrs: ", errors);
  errors.array().forEach(error => {
      //console.log("#>>> ", error, " :: ", error.param);
      let found = validationErr.filter(errItem => error.param === errItem.param);
      if (!found.length) {
        validationErr.push(error);
      }       
  });
  if(validationErr.length){
    validationErr.forEach(rec => {
       validationErrMesg.push({field: rec.param, message: rec.msg});
    })
    resp.status(422).json({ errors: validationErrMesg, status:0 });
    return true;
  }
  return false;
}
//-----------------------------------------------------------------------
//-----------------API Required Field Validation ------------------------
//-----------------------******** END ********** ------------------------
//-----------------------------------------------------------------------
//API Guard
/****************
 * () => APIGuard
 * require Token from headers
 */
 exports.authRequired = (req, res, next) => {
  //console.log("@Request Header: ", req.user);
 if (req.user) {
   next();
 } else {  
   return res.status(401).json({ status: 0, message: 'Valid Token Required!' });
 }
};

//Add List with pagination limit
/*-----------------------------------
/-------------LIST Patient-----------
/---@body: NULL ---------------------
/------------------------------------
------------------------------------*/
 exports.getList  =  (req, resp) =>{
    let pg_limit     = 1; 
    let offset       = 0;
    if(req.query.op !== undefined && req.query.op == 'one'){
        theModel.findAndCountAll(
          {
            limit: limit,
            order: [['id', 'DESC']]
          }
        ).then(patientRecord => {
          resp.status(200).json({ message: 'patient Lists',status : 1, data: patientRecord.rows[0], totalCount: patientRecord.count });
          return;
        }).catch(function (error) {
          resp.status(400).send('List Error: ', error);
          return;
        });
    }
    else if(req.query.op !== undefined && req.query.op == 'all'){
          pg_limit  = req.query.limit;
          offset    = 0 + (req.query.page - 1) * pg_limit;
          theModel.findAndCountAll(
            {
              offset: offset,
              limit: parseInt(pg_limit),
              order: [['id', 'DESC']]
            }
          ).then(patientRecord => {
            resp.status(200).json({ message: 'patient Lists',status : 1, data: patientRecord.rows, totalCount: patientRecord.count });
            return;
          }).catch(function (error) {
            resp.status(400).send('List Error: ', error);
            return;
          });
    }else{
          resp.status(200).json({ message: 'Please check [op] parameter to be valid entry',status : 0 });
          return;
    }
}

//Get patient By Mobile
exports.searchByMob  =  (req, resp)  =>{
  if(req.query.mob == undefined || req.query.mob == null){
      resp.status(400).json({ message: 'Parameter id Not found.',status : 0 });
      return;
  }  
  let getMobile =  req.query.mob || null;
  theModel.findAll({
    where: {
      pt_mobile: {
        [Op.like]: '%'+getMobile+'%'
      }
    }
  }).then(patientRecord => {
    console.log("@patient Data: ", patientRecord);
    resp.status(200).json({ message: 'patient By Record',status : 1, data: patientRecord });
    return;
  }).catch(function (error) {
    resp.status(400).send('List Error: ', error);
  });
}

//Get patient By Case ID
exports.searchByCaseID  =  (req, resp)  =>{
  if(req.query.case_id == undefined || req.query.case_id == null){
      resp.status(400).json({ message: 'Parameter Case ID Not found.',status : 0 });
      return;
  }  
  let getID =  req.query.case_id || null;
  theModel.findOne({
    where: {
      pt_case_id: getID
    }
  }).then(patientRecord => {
    console.log("@patient Data: ", patientRecord);
    resp.status(200).json({ message: 'patient By Record',status : 1, data: patientRecord });
    return;
  }).catch(function (error) {
    resp.status(400).send('List Error: ', error);
  });
}

exports.isEmptyObject = (object) => {
for(let key in object){
    if(object.hasOwnProperty(key)){
        return false;
    }
}
return true;
}

/*-----------------------------------
/-------------CREATE patient -----------
/---@body: [id, email,patientname]------
/------------------------------------
------------------------------------*/

exports.create  = function(req, resp){
  var getData  = req.body || null;
  //Add required validation
  theController.apiValidation(req, resp);
  if(typeof getData === 'object'){
    var getMobile        = getData.pt_mobile || '';
    var getCaseDate      = getData.pt_case_date || '';
    if(getData.pt_mobile){
      theModel.findOne({
        where: {
          pt_mobile: getMobile,
          pt_case_date: getCaseDate
       }
      }).then(result => { 
          if(result != null){
            resp.json({ message: 'Duplicate patient!',status : 0 });
            return;
          }
          if(result === null){
            console.log("@Creating patient....3");
            theModel.create(getData).then(insertRecord => {
              let getRecord = insertRecord.dataValues;
              insertRecord = getRecord;
                if(insertRecord.pt_id != undefined && insertRecord.pt_id != ''){
                    let patientId = insertRecord.pt_id;
                    resp.status(200).json({ message: 'patient Created Successfully', status:1, record: insertRecord, id: patientId });
                    return;
                }
            })
            .catch(function(err){
                resp.status(400).json({ message: "DB Insert Error!", status : 0, error: err });
                return;
            });
                        
         }
      });
    }      
  }
}

/*-----------------------------------
/-------------UPDATE patient -----------
/---@body: [id, email,patientname]------
/------------------------------------
------------------------------------*/
//Update patient
/**************** 
 * () => patientUpdate
 * @body     -   POST Body Data
 * Query Params /?id
 * All model field data 
 * 
 */
 exports.update  = (req, resp, next) => {    

  console.log(">>GET POST: ",  " == ", req.method, " ::: ", req.files, " :: ", req.body );
  var validReturn   = theController.apiValidation(req, resp);
  if(validReturn) return;

  let getData     =   req.body || null;
  let getParams   =   req.query || null;
  let patientId   = '';
  
  console.log("@updating patient....1 : ",getData, " :: ", getParams); 

  if(getParams != undefined && typeof getParams === 'object'){
      if(getParams.id === undefined){
          resp.status(400).json({ message: "Update: id params required", status : 0});
          return;
      }
      if(getParams.id !== undefined && getParams.id == ''){
          resp.status(400).json({ message: "Update: id params should be a Valid ID value", status : 0});
          return;
      }
      patientId = getParams.id;
  }
  console.log(">>>> params: ", getParams, " :: ", patientId);
  if(typeof getData === 'object'){
      var getMobile       = getData.pt_mobile || '';
      if(getMobile){
        theModel.findOne({           
          where: {
            pt_mobile: getData.pt_mobile,
            pt_case_date: getData.pt_case_date,
            pt_id: {
              [Op.ne]: patientId
            }
         }
        }).then(patient =>
          {
            console.log(">>> found: ", patient);
              if(patient != null && typeof patient === 'object' && typeof patient.dataValues === 'object'){
                resp.json({ message: "patient Already Exists.", record : patient });
                return;
              }               
              if(patient === null){
                console.log("@@@@@@@@Need to update....");
                
                let updateData = getData;
                
                theModel.update(updateData, {where:{pt_id : patientId}}       
                  ).then((result)=>{
                    console.log("@@@@ Record Updated....");
                    resp.status(200).json({ message: 'Record Updated!',status : 1, record: result });
                  })
                  .catch((err)=>{
                    console.log("@@@@ Record Updated Error....");
                    resp.status(400).json({ message: " Update Error!", status : 0, error: err });
                  })
            }
        });
      }
      return;
   }    
}

/*-----------------------------------
/------------- DELETE patient ----------
/---@param: id [i.e. /patient?id=]------ 
/------------------------------------
------------------------------------*/
exports.delete = function(req, resp) {
  theModel.destroy({
    where: {
      pt_id: req.query.id
    }
  }).then((result) => {
      if(result)
        resp.json({ message: variableDefined.variables.record_deleted,'status' : result });
      else
        resp.json({ message: variableDefined.variables.record_deleted_error,'status' : result });
  })
};
