import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/Todo');


var taskSchema = mongoose.Schema({
    name: String,
    done: Boolean,
    owner: mongoose.Schema.Types.ObjectId,
    parents: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('Task', taskSchema);