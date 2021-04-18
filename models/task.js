var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TasksSchema = new Schema({
    url: {type: String, required: true},
    startDate: {type: Date, required: false},
    lastDate: {type: Date, required: false},
});


// Export the model
module.exports = mongoose.model('Tasks', TasksSchema);