const express = require('express');
const router = express.Router();
const api = require('../models/api');
//用户登录注册修改密码
router.get('/getValue', (req, res, next) => {
  api.getValue(req, res, next);
});
router.post('/setValue', (req, res, next) => {
  api.setValue(req, res, next);
});
router.post('/updateValue', (req, res, next) => {
  api.updateValue(req, res, next);
});
//用户获取小说
router.get('/getNovel',(req,res,next)=>{
  api.getNovel(req,res,next);
});
router.post('/addNovel',(req,res,next)=>{
  api.addNovel(req,res,next);
})
//学习计划
router.post('/setReadingPlan',(req,res,next)=>{
  api.setReadingPlan(req,res,next);
});
router.get('/getReadingPlan',(req,res,next)=>{
  api.getReadingPlan(req,res,next);
});
router.post('/updateReadingPlan',(req,res,next)=>{
  api.updateReadingPlan(req,res,next);
});
router.post('/deleteReadingPlan',(req,res,next)=>{
  api.deleteReadingPlan(req,res,next);
});
module.exports = router;