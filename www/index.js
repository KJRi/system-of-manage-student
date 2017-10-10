// 定义一个变量表示当前展示第几页的数据
//var page = 1;
var page = $.cookie("page");
if(!page){
	page = 1;
}

// 封装一个方法，获取对应页码对应的数据
function getStudentsOfPage(){
	// 展示网络请求标识
	// para1：0~2 标识的风格  para2：0.1透明度的白色背景
	layer.ready(function(){
		var index = layer.load(0,{shade: [0.1,'#aaa']});
		// 发送网络请求
		var url = "/student/info?page="+page;
		$.get(url,function(resData){
			// 关闭网络请求标识
			// layer.close(index);
			layer.closeAll();
			// 数据和模板结合（渲染）
			var htmlStr = template("list",resData) + template("indicator",resData);
			$("#students").html(htmlStr);
		});
	});
}
getStudentsOfPage();

// 给页码指示器添加点击事件
// 不能直接给 "a.choosePage" 添加事件，因为这些代码执行的时候，
// 页面指示器可能还没拼接到 document（等到网络请求完毕）
// $("a.choosePage").click(function(){
//	 alert("换页");
// });
// 用代理事件
$("#students").on("click","a.choosePage",function(){
	// 重复点击当前页不用发送网络请求
	if (page == $(this).data("page")) {
		return;
	}
	// 根据点击的页码改变 page
	// page = $(this).text();
	page = $(this).data("page");
	//把page 的值存入cookie
	$.cookie("page",page);
	// 重新发送网路请求
	getStudentsOfPage();
});


// 删除
$("#students").on("click","span.trash",function(){
	var result = confirm("确定要删除吗？");
	if (result) {
		$.post("/student/delete",{_id:$(this).data("id")},function(resData){
			alert(resData);
			// 重新请求本页面
			getStudentsOfPage();
		});
	}
});

//编辑
$("#students").on("click","span.edit",function(){
	location.href = "/edit?_id="+$(this).data("id");
});

//搜索
$("#search").click(function(){
	layer.ready(function(){
		layer.load(1,{shade:[0.1,'#fff']});
		$.get("/student/search",$("form").serialize(),function(resData){
			layer.closeAll();
			var htmlStr = template("list",resData);
			$("#students").html(htmlStr);
		})
	})
})




