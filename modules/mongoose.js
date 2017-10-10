// 处理 mongoose 模块
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ZhongBei");
mongoose.connection.on("open",function(){
	console.log("数据库打开成功");
});
var Schema = mongoose.Schema;
var StudentSchema = new Schema({
	name: String,
	age: Number,
	gender: Boolean,
	phone: String,
	email: String,
	detail: {type:String,default:"无"},
	createTime: Date
},{
	// 数据集合的名字
	collection:"h5",
	// 去掉版本号 __v
	versionKey: false
});
var Student = mongoose.model("Student",StudentSchema);

// 导出
module.exports = Student;


