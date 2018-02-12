import Task from "./task.model";


function createTask(id, body, callback) {
    var myTask = new Task({
        name: body.name,
        done: false,
        owner: id,
        parents: body.originates
    });

    myTask.save((err, task) => {
        if (err) {
            callback(err);
        }
        else {
            callback(null, task);
        }
    });

}

function getMyTasks(id, callback) {
    Task.find({ owner: id }, callback)
}

function deleteMyTask(id, taskid, callback) {
    Task.findById(taskid, (err, task) => {

        if (err) {
            callback(err)
        }
        else {

            if (task.owner == id) {
                Task.deleteOne(taskid, callback);
            }
            else {
                callback("Not found")
            }
        }
    })
}

//FIXME: Make sure that you are looping through fields that we are exposing to user
function updateTask(id, taskid, options, callback) {
    let updateableFields = ['parents', 'name', 'done']; //TODO: Originates should be in the list of user task ids
    let changed = false;
    Task.findById(taskid, (err, task) => {
        if (err) {
            callback(err);
        }
        else {
            if (task.owner == id) {
                Object.keys(options).forEach((key) => {
                    if (updateableFields.includes(key)) {
                        task[key] = options[key];
                        changed = true;
                    }
                });

                if (changed) {
                    task.save(callback);
                }
                else{
                    callback("done", null);
                }
            }
            else {
                callback("Not found")
            }
        }
    })
}

export { createTask, getMyTasks, deleteMyTask, updateTask };
