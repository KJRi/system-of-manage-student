// 处理 express 和 body-parser 和 art-template 模块
var express = require("express");
var app = express();
app.use(express.static("www"));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var template = require("art-template");
template.config("cache",false);
app.engine(".html",template.__express);
app.set("view engine","html");

// 导入并使用路由
app.use(require("./routers/view"));
app.use("/student",require("./routers/student"));

app.listen(3000,function(){
	console.log("server is running ……");
});
