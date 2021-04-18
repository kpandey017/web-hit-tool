var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskLogSchema = new Schema({
    qid: {type: String, required: true},
    date: {type: Number, required: false},
    month: {type: String, required: true},
    count: {type: Number, required: false},
});


// Export the model
module.exports = mongoose.model('TaskLogs', TaskLogSchema);