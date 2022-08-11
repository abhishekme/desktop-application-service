'use strict'

//Get ORM object
var testCategoryController  = require('./testCategory');
var constants               = require('../../config/constants');
const { body,validationResult,check } = require('express-validator');
const Sequelize             = require('sequelize'); 
const Op                    = Sequelize.Op;
const db                    = require('../models');
const theModel              = db.test_category; 
const theController         = testCategoryController;
const variableDefined       = constants[0].application;
const env = process.env.NODE_ENV || 'development';

//console.log("::TestCategory:: ", theModel);
//return;

//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------
exports.validate = (method) => {
  switch (method) {
    case 'create' : {
     return [ 
        body('test_cat_name', variableDefined.variables.test_cat_name).exists(),
        body('test_cat_short_name', variableDefined.variables.test_cat_short_name).exists(),
        body('test_cat_status', variableDefined.variables.test_cat_status).exists(),        
       ]   
    }
    
    case 'update' : {
      return [ 
        body('test_cat_name', variableDefined.variables.pt_name).exists(),
        body('test_cat_short_name', variableDefined.variables.pt_addr).exists(),
        body('test_cat_status', variableDefined.variables.pt_case_date).exists(),       
        ]   
     }
  }
}

exports.apiValidation   = function(req,resp){
  //console.log("Enter...bod: ", req.body);
  const errors          = validationResult(req);
  var validationErr     = [];
  var validationErrMesg = [];

  errors.array().forEach(error => {
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
            order: [['test_cat_id', 'DESC']]
        }
        ).then(dataRecord => {
            resp.status(200).json({ message: 'Test Category Lists',status : 1, data: testCategoryRecord.rows[0], totalCount: testCategoryRecord.count });
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
              order: [['test_cat_id', 'DESC']]
            }
        ).then(dataRecord => {
            resp.status(200).send({ message: 'Test Category Lists',status : 1, data: dataRecord.rows, totalCount: dataRecord.count });
            return;
        }).catch(function (error) {
            resp.status(400).send({mesage:"List Error", error: error});            
            return;
        });
    }else if(req.query.op !== undefined && req.query.op == 'total'){
      pg_limit    = req.query.limit;
      theModel.findAndCountAll(
          {
            order: [['test_cat_id', 'DESC']]
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
exports.searchByCategoryName  =  (req, resp)  =>{
  if(req.query.cat_name == undefined || req.query.cat_name == null){
      resp.status(400).json({ message: 'Parameter [cat_name] Not found.',status : 0 });
      return;
  }  
  let getCatName  =  req.query.cat_name || null;
  theModel.findAll({
    where: {
        test_cat_name: {
            [Op.like]: '%'+getCatName+'%'
      }
    }
  }).then(testCategoryRecord => {
    console.log("@testCategory Data: ", testCategoryRecord);
    resp.status(200).json({ message: 'Test Category By Record',status : 1, data: testCategoryRecord });
    return;
  }).catch(function (error) {
    resp.status(400).send({mesage:"List Error", error: error}); 
  });
}

//Get testCategory By Category Short Name
exports.searchByShortName  =  (req, resp)  =>{
    if(req.query.short_name == undefined || req.query.short_name == null || req.query.short_name == ''){
        resp.status(400).json({ message: 'Parameter [short_name] Not found.',status : 0 });
        return;
    }  
    let getCatShortName  =  req.query.short_name || null;
    theModel.findAll({
      where: {
            test_cat_short_name: {
              [Op.like]: '%'+getCatShortName+'%'
        }
      }
    }).then(testCategoryRecord => {
      console.log("@testCategory Data: ", testCategoryRecord);
      resp.status(200).json({ message: 'Test Category By Record',status : 1, data: testCategoryRecord });
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
  if(typeof getData === 'object'){    
    console.log("@Post: ",getData );
    if(getData.test_cat_name != '' && getData.test_cat_short_name != '' && getData.test_cat_status != ''){
      theModel.findOne({
        where: {
            [Op.or]: [{test_cat_name: getData.test_cat_name}, {test_cat_short_name: getData.test_cat_short_name}]
         }
      }).then(result => { 
          if(result != null){
            resp.json({ message: 'Duplicate Test Category!',status : 0 });
            return;
          }
          if(result === null){
            theModel.create(getData).then(insertRecord => {
              let getRecord = insertRecord.dataValues;
              insertRecord = getRecord;
                if(insertRecord.test_cat_id != undefined && insertRecord.test_cat_id != ''){
                    let testCategoryId = insertRecord.test_cat_id;
                    resp.status(200).json({ message: 'Test Category Created Successfully', status:1, record: insertRecord, id: testCategoryId });
                    return;
                }
            })
            .catch(function(err){
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
  let testCategoryId    =   '';
  
  if(getParams != undefined && typeof getParams === 'object'){
      if(getParams.id === undefined){
          resp.status(400).json({ message: "Update: id params required", status : 0});
          return;
      }
      if(getParams.id !== undefined && getParams.id == ''){
          resp.status(400).json({ message: "Update: id params should be a Valid ID value", status : 0});
          return;
      }
      testCategoryId = getParams.id;
  }

  if(typeof getData === 'object'){
      if(getData.test_cat_name && getData.test_cat_short_name){
        theModel.findOne({
            where: {
                [Op.or]: [{test_cat_name: getData.test_cat_name}, {test_cat_short_name: getData.test_cat_short_name}],
                test_cat_id : {
                  [Op.ne]: testCategoryId
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
                theModel.update(updateData, {where:{test_cat_id : testCategoryId}}       
                  ).then((result)=>{
                    resp.status(200).json({ message: 'Record Updated!',status : 1, updateId: testCategoryId });
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
        test_cat_id: req.query.id
    }
  }).then((result) => {
      if(result)
        resp.json({ message: variableDefined.variables.record_deleted,'status' : result });
      else
        resp.json({ message: variableDefined.variables.record_deleted_error,'status' : result });
  })
};
