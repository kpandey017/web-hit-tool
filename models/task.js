var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TasksSchema = new Schema({
    url: {type: String, required: true},
    uid: {type: String, required: true},
    region:[{type: String}],
    startDate: {type: Date, required: false},
    lastDate: {type: Date, required: false},
    todayVisit: {type: Number, required: false},
    totalVisit: {type: Number, required: false},
    lastVisit: {type: Date, required: false},
});


// Export the model
module.exports = mongoose.model('Tasks', TasksSchema);
