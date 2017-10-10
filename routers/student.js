// 处理学生的增删改查请求

var express = require("express");
var router = express.Router();
var Student = require("../modules/mongoose");

router.post("/add",function(req,res){
	// 自行补充添加时间
	req.body.createTime = new Date();
	// 存入数据库
	var stu = new Student(req.body);
	stu.save(function(err){
		if (!err) {
			res.redirect("/");
		}else{
			res.status(200).send('<script>location.href="/";alert("存储数据失败");</script>');
		}
	});
});

// 获取首页数据
// 假设一页默认展示 5 条
var countOfPage = 5;
router.get("/info",function(req,res){
	// 返回：title 当前对应页面的数据 展示可切换的页码pages 所有的页数allPages
	
	// 假设前端传递 countOfPage = 10；
	// countOfPage = req.query.countOfPage;
	
	// 用户需要获取第几页数据
	var page = Number(req.query.page);
	if (!page) {
		page = 1;
	}
	
	// 获取所有数据的个数
	Student.count(function(err,count){
		if (!err) {
			// 一共可以分多少页（最大页码）
			var allPages = Math.ceil(count / countOfPage);
			// 对 page 的取值进行过滤
			if (page > allPages) {
				page = allPages;
			}
			if (page < 1) {
				page = 1;
			}
			
			// 获取前几页和后几页（根据当前页和总页数）
			var showPages = getShowPages(page,allPages);
			
			// 查询对应数据
			Student.find({},function(err,data){
				if (!err) {
					res.status(200).json({
						data,
						page,
						allPages,
						showPages
					});
				}
			}).skip(countOfPage*(page-1)).limit(countOfPage);
		}
	});
});

// 根据当前页和总页数获取 showPages
function getShowPages(page,allPages){
	var showPages = [];
	if (allPages <= 5) {
		for (var i = 0; i < allPages; i++) {
			showPages.push(i+1);
		}
	} else{
		/*
		// 方案一：
		showPages.push(page);
		for (var i = 0; i < 4; i++) {
			if (page+i+1 > allPages) {
				showPages.unshift(allPages-i-1);
			}else{
				showPages.push(page+i+1);
			}
		}
		*/
		
		/*
		// 方案二：
		showPages.push(page);
		while(showPages.length < 5){
			if (page - showPages.length < 1) {
				showPages.push(showPages.length + 1);
			} else{
				showPages.unshift(page - showPages.length);
			}
		}
		*/
		
		// 方案三：
		showPages.push(page);
		var offset = 1;
		while(showPages.length < 5){
			if (page - offset > 0) {
				showPages.unshift(page - offset);
			}
			if (page + offset <= allPages) {
				showPages.push(page + offset);
			}
			offset ++;
		}
	}
	return showPages;
}

// 删除学生
router.post("/delete",function(req,res){
	Student.remove(req.body,function(err,result){
		if (!err) {
			res.status(200).send("删除数据成功");
		} else{
			res.status(200).send("删除数据失败");
		}
	});
});

//更新学生信息
router.post("/update",function(req,res){
//	console.log("要执行更新操作了");
//	console.log(req.body);
     student.update(req.query,req.body,function(err,result){
     	if(!err){
     		res.redirect("/");
     		
     	}else{
     		res.status(200).send("更新数据失败");
     	}
     });
});

//搜索学生信息
router.get("/search",function(req,res){
	console.log(req.query);
	//获取（拼接）搜索条件
	var condition = {};
	if(req.query.name){
//		var reg = new RegExp(req.query.name);
		condition.name = {$regex: req.query.name};
	}
	if(req.query.gender == "true"){
		condition.gender = "true";
	}else if(req.query.gender == "false"){
		condition.gender = "false";
	}
	
	if(req.query.phone){
		condition.phone  = {$regex: req.query.phone};
	}
	console.log(condition);
	Student.find(condition,function(err,data){
		console.log(data);
		if(!err){
			res.status(200).json({data});
		}
	});
});

module.exports = router;
