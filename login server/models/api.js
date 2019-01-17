//连接数据库，各种方法的实现
const mysql = require('mysql');
const dbConfig = require('./db');
const sqlMap = require('./sqlMap');

const pool = mysql.createPool({
  host: dbConfig.mysql.host,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database,
  port: dbConfig.mysql.port,
  multipleStatements: true    // 多语句查询
});

module.exports = {
  //用户登录注册修改密码
  getValue(req, res, next) {
    var name = req.query.name;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getValue;
      connection.query(sql, [name], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },
  setValue(req, res, next) {
    console.log(req.body);
    var name = req.body.name, pass = req.body.pass;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.setValue;
      connection.query(sql, [pass, name], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },
  updateValue(req, res, next) {
    console.log(req.body);
    var name = req.body.name, pass = req.body.pass;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updateValue;
      connection.query(sql, [pass, name], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },
  //用户获取小说
  getNovel(req,res,next){
    console.log(req.body);
    pool.getConnection((err,connection)=>{
      var sql = sqlMap.getNovel;
      connection.query(sql,(err,result)=>{
        res.json(result);
        connection.release();
      })
    })
  },
  addNovel(req,res,next){
    console.log(req.body);
    var bookname = req.body.bookname, author = req.body.author, content = req.body.content;
    pool.getConnection((err,connection)=>{
      var sql = sqlMap.addNovel;
      connection.query(sql,[content, author, bookname],(err,result)=>{
        res.json(result);
        connection.release();
      })
    })
  },
  //学习计划
  setReadingPlan(req,res,next){
    console.log(req.body);
    var bookname = req.body.bookname,author = req.body.author,statu = req.body.statu,finish_time = req.body.finish_time,type = req.body.type,content = req.body.content;
    pool.getConnection((err,connection)=>{
      var sql = sqlMap.setReadingPlan;
      connection.query(sql,[content,type,finish_time,statu,author,bookname],(err,result)=>{
        res.json(result);
        connection.release();
      })
    })
  },
  getReadingPlan(req,res,next){
    console.log(req.body);
    pool.getConnection((err,connection)=>{
      var sql = sqlMap.getReadingPlan;
      connection.query(sql,(err,result)=>{
        res.json(result);
        connection.release();
      })
    })
  },
  updateReadingPlan(req,res,next){
    console.log(req.body);
    var bookname = req.body.bookname,author = req.body.author,statu = req.body.statu,finish_time = req.body.finish_time;
    pool.getConnection((err,connection)=>{
      var sql = sqlMap.updateReadingPlan;
      connection.query(sql,[finish_time,statu,author,bookname],(err,result)=>{
        res.json(result);
        connection.release();
      })
    })
  },
  deleteReadingPlan(req,res,next){
    console.log(req.body);
    var bookname = req.body.bookname,author = req.body.author;
    pool.getConnection((err,connection)=>{
      var sql = sqlMap.deleteReadingPlan;
      connection.query(sql,[author,bookname],(err,result)=>{
        res.json(result);
        connection.release();
      })
    })
  }
}
