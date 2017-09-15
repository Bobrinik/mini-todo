import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/Todo');


var taskSchema = mongoose.Schema({
    task: String,
    done: Boolean,
    belongs: mongoose.Schema.Types.ObjectId,
    originates: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('Task', taskSchema);