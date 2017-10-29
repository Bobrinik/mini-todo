angular.module("app")
    .factory("tasksStorage", function taskStorageFactory() {
        var data = {};
        return {
            getTasks: function () {
                return data;
            },
            setTasks: function (tasks) {
                data = tasks;
            }
        };
    });