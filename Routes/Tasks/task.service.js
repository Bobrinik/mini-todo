import Task from "./task.model";


function createTask(id, body, callback) {
    var myTask = new Task({
        task: body.task,
        done: false,
        belongs: id,
        originates: body.originates
    });

    myTask.save((err, task) => {
        if (err) {
            callback(err)
        }
        else {
            console.log("Saving");
            console.log(task);
            callback(null, task);
        }
    });

}

export { createTask };