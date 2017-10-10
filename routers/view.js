// 处理页面

var express = require("express");
var router = express.Router();
var Student = require("../modules/mongoose");

// 添加学生信息页面
router.get("/add",function(req,res){
	res.render("add",{
		title:"添加学生信息",
		submitTitle:"添加"
		});
});
//编辑学生信息页面
router.get("/edit",function(req,res){
	Student.findOne(req.query,function(err,data){
		if(!err){
			res.render("add",{
				title:"修改学生信息",
		        submitTitle:"修改",
		        student: data
			})
		};
	});
});

module.exports = router;
