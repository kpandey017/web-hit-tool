var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://krishnapandey0106:kkkkcccc1994@cluster0.gqs5s.mongodb.net/boosapp';
//var dev_db_url = 'mongodb://localhost:27017/proxy';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var task_controller = require('./controllers/task');

var execAllTasks=async (tasks)=>{
    await task_controller.navigateUrl(tasks);
};


task_controller.get_all_live_tasks(execAllTasks);

