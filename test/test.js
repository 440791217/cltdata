/**
 * Created by mark on 2017/1/20.
 */
var log=require('mark_logger');
var cltData=require('../index');
var clear="12345678";
var pwd=cltData.cryptPwd(clear);
log.d("clear:"+clear+"--pwd:"+pwd);