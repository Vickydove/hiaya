//sql语句
var sqlMap = {
    //用户登录注册修改密码
    getValue: 'SELECT * FROM users WHERE name = ?',
    setValue: 'INSERT INTO users(pass,name) VALUES(?,?)',
    updateValue: 'UPDATE users SET pass = ? WHERE name = ?',
    //用户获取小说
    getNovel: 'SELECT * FROM novel',
    addNovel: 'INSERT INTO novel(content,author,bookname) VALUES(?,?,?)',
    //学习计划
    setReadingPlan: 'INSERT INTO readingplan(content,type,finish_time,statu,author,bookname) VALUES(?,?,?,?,?,?)',
    getReadingPlan: 'SELECT * FROM readingplan',
    updateReadingPlan: 'UPDATE readingplan SET finish_time = ?,statu = ? WHERE author = ? AND bookname = ?',
    deleteReadingPlan: 'DELETE FROM readingPlan WHERE author = ? AND bookname = ?'
  }
  
  module.exports = sqlMap;