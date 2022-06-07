'use strict'

//Get ORM object
var testMasterController    = require('./testMaster');
var constants               = require('../../config/constants');
const { body,validationResult,check } = require('express-validator');
const Sequelize             = require('sequelize'); 
const Op                    = Sequelize.Op;
const db                    = require('../models');
const theModel              = db.test_master; 
const theController         = testMasterController;
const variableDefined       = constants[0].application;
const env                   = process.env.NODE_ENV || 'development';

//console.log("::TestCategory:: ", theModel);
//return;
//mmm

//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------
exports.validate = (method) => {
  switch (method) {
    case 'create' : {
     return [ 
        body('test_cat_id', variableDefined.variables.test_cat_id).exists(),
        body('test_name', variableDefined.variables.test_name).exists(),
        body('test_status', variableDefined.variables.test_status).exists(),
        body('test_amount', variableDefined.variables.test_amount).exists(),        
       ]   
    }
    
    case 'update' : {
      return [ 
        body('test_cat_id', variableDefined.variables.test_cat_id).exists(),
        body('test_name', variableDefined.variables.test_name).exists(),
        body('test_status', variableDefined.variables.test_status).exists(),
        body('test_amount', variableDefined.variables.test_amount).exists(),        
        ]   
     }
  }
}

exports.apiValidation   = function(req,resp){
  //console.log("Enter...bod: ", req.body);
  const errors          = validationResult(req);
  var validationErr     = [];
  var validationErrMesg = [];

  console.log("@Valid Errorrs: ", errors);
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
/-------------LIST testCategory-----------
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
            order: [['test_id', 'DESC']]
        }
        ).then(dataRecord => {
            resp.status(200).json({ message: 'Test Category Lists',status : 1, data: dataRecord.rows[0], totalCount: dataRecord.count });
            return;
        }).catch(function (error) {
            resp.status(400).send({mesage:"List Error", error: error}); 
            return;
        });

    }else if(req.query.op !== undefined && req.query.op == 'all'){
        pg_limit    = req.query.limit;
        offset      = 0 + (req.query.page - 1) * pg_limit;
        theModel.findAndCountAll(
            {
              offset: offset,
              limit: parseInt(pg_limit),
              order: [['test_id', 'DESC']]
            }
        ).then(dataRecord => {
            resp.status(200).json({ message: 'Test Category Lists',status : 1, data: dataRecord.rows, totalCount: dataRecord.count });
            return;
        }).catch(function (error) {
          resp.status(400).send({mesage:"List Error", error: error}); 
            return;
        });
    }else if(req.query.op !== undefined && req.query.op == 'total'){
      pg_limit    = req.query.limit;
      theModel.findAndCountAll(
          {
            order: [['test_id', 'DESC']]
          }
      ).then(dataRecord => {
          let totalPage   = Math.ceil(dataRecord.count / pg_limit);
          resp.status(200).json({ message: 'Test Category Lists',status : 1, totalPage: totalPage, totalCount: dataRecord.count });
          return;
      }).catch(function (error) {
        resp.status(400).send({mesage:"List Error", error: error}); 
          return;
      });
  }else{
        resp.status(200).json({ message: 'Please check [op] parameter to be valid entry',status : 0 });
        return;
    }
}

//Get testCategory By Mobile
exports.searchByTestName  =  (req, resp)  =>{
  if(req.query.test_name == undefined || req.query.test_name == null){
      resp.status(400).json({ message: 'Parameter [test_name] Not found.',status : 0 });
      return;
  }  
  let getTestName  =  req.query.test_name || null;
  theModel.findAll({
    where: {
        test_name: {
            [Op.like]: '%'+getTestName+'%'
      }
    }
  }).then(dataRecord => {
    console.log("@testCategory Data: ", dataRecord);
    resp.status(200).json({ message: 'Test Master By Record',status : 1, data: dataRecord });
    return;
  }).catch(function (error) {
    resp.status(400).send({mesage:"List Error", error: error}); 
  });
}

//Get testCategory By Category Short Name
exports.searchByTestCategory  =  (req, resp)  =>{
    if(req.query.test_cat_id == undefined){
        resp.status(400).json({ message: 'Parameter [test_cat_id] Not found.',status : 0 });
        return;
    }  
    let getCatID  =  req.query.test_cat_id || null;
    theModel.findAll({
      where: {
        test_cat_id: {
            [Op.eq]: getCatID
        }
      }
    }).then(dataRecord => {
      console.log("@testCategory Data: ", dataRecord);
      resp.status(200).json({ message: 'Test Master By Record',status : 1, data: dataRecord });
      return;
    }).catch(function (error) {
      resp.status(400).send({mesage:"List Error", error: error}); 
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
/-------------CREATE testCategory -----------
/---@body: [id, email,testCategoryname]------
/------------------------------------
------------------------------------*/

exports.create  = function(req, resp){
  var getData  = req.body || null;
  //Add required validation
  theController.apiValidation(req, resp);
 // return;
  if(typeof getData === 'object'){    
    console.log("@Post: ",getData, " :: ", getData.test_name );
    if(getData.test_cat_id != '' && getData.test_name != '' && getData.test_amount != ''){
      console.log("@Post:2 ",getData, " :: ", getData.test_name );
      theModel.findOne({
        where: {
            test_name: getData.test_name,
            test_cat_id : {
                [Op.eq]: getData.test_cat_id
              }
         }
      }).then(result => { 
        console.log("@Get TEst cat: ", result);
          if(result != null){
            resp.json({ message: 'Duplicate Test Category!',status : 0 });
            return;
          }
          if(result === null){
            console.log("@Creating testCategory....", getData);
            //return;
            theModel.create(getData).then(insertRecord => {
              let getRecord = insertRecord.dataValues;
              insertRecord = getRecord;
              console.log("@Creating testCategory....", getData);
                if(insertRecord.test_cat_id != undefined && insertRecord.test_cat_id != ''){
                    let testCategoryId = insertRecord.test_cat_id;
                    resp.status(200).json({ message: 'Test Category Created Successfully', status:1, record: insertRecord, id: testCategoryId });
                    return;
                }
            })
            .catch(function(err){
              console.log("@Post:3 Error ",err );
                resp.status(400).json({ message: "DB Insert Error!", status : 0, error: err });
                return;
            });
                        
         }
      });
    }else{
        resp.status(400).json({ message: "Please check entry", status : 0});
                return;
    }      
  }
}

/*-----------------------------------
/-------------UPDATE testCategory -----------
/---@body: [id, email,testCategoryname]------
/------------------------------------
------------------------------------*/
//Update testCategory
/**************** 
 * () => testCategoryUpdate
 * @body     -   POST Body Data
 * Query Params /?id
 * All model field data 
 * 
 */
 exports.update  = (req, resp, next) => {    

  var validReturn   = theController.apiValidation(req, resp);
  if(validReturn) return;

  let getData           =   req.body || null;
  let getParams         =   req.query || null;
  let testMasterId      =   '';  

  if(getParams != undefined && typeof getParams === 'object'){
      if(getParams.id === undefined){
          resp.status(400).json({ message: "Update: id params required", status : 0});
          return;
      }
      if(getParams.id !== undefined && getParams.id == ''){
          resp.status(400).json({ message: "Update: id params should be a Valid ID value", status : 0});
          return;
      }
      testMasterId = getParams.id;
  }

  if(typeof getData === 'object'){
    if(getData.test_cat_id != '' && getData.test_name != '' && getData.test_amount != ''){
        theModel.findOne({
            where: {
                test_name: getData.test_name,
                test_cat_id : {
                    [Op.eq]: getData.test_cat_id
                },
                test_id : {
                    [Op.ne]: testMasterId
                }
             }
        }).then(testCategory =>
          {
              if(testCategory != null && typeof testCategory === 'object' && typeof testCategory.dataValues === 'object'){
                resp.json({ message: "Test Category Already Exists.", record : testCategory });
                return;
              }               
              if(testCategory === null){
                let updateData = getData;
                theModel.update(updateData, {where:{test_id : testMasterId}}       
                  ).then((result)=>{
                    resp.status(200).json({ message: 'Record Updated!',status : 1, updateId: testMasterId });
                  })
                  .catch((err)=>{
                    resp.status(400).json({ message: " Update Error!", status : 0, error: err });
                  })
            }
        });
      }
    return;
   }    
}

/*-----------------------------------
/------------- DELETE testCategory ----------
/---@param: id [i.e. /testCategory?id=]------ 
/------------------------------------
------------------------------------*/
exports.delete = function(req, resp) {
  theModel.destroy({
    where: {
        test_id: req.query.id
    }
  }).then((result) => {
      if(result)
        resp.json({ message: variableDefined.variables.record_deleted,'status' : result });
      else
        resp.json({ message: variableDefined.variables.record_deleted_error,'status' : result });
  })
};
