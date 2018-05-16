/*
 * 获取域名
 * Created by 龙鸿轩 on 2018/05/15.
 */
export const getServer = () => {
  let server = '';
  if (process.env.NODE_ENV.trim() == "production")
    server = 'https://www.mymengqiqi.com/mhshi/ajax/' //线上就换阿里地址
  //server = 'http://localhost:8066/ajax/' //本地走nginx反向代理api跨域
  if (process.env.NODE_ENV.trim() == "development")
    server = '/api2/ajax/'
  return server
}
/*
 * 时间格式化
 * Created by 龙鸿轩 on 2018/05/16.
 */
export const getNowFormatDate = (date = new Date()) => {
  //var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();

  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();

  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }

  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (ss < 10) {
    ss = "0" + ss;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate + "  " + hh + ":" + mm + ":" + ss;
  return currentdate;
}