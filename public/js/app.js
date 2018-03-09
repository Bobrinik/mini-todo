// TODO:
/*
After the user logs in we are going to hide login menue and we are going to let him add and delete nodes
on the transperent canvas
*/

(function () {
    var loggedIn = new Event('login_success', { data: "hello" });
    var token;
    var tasks;


    var app = angular.module('app', []);
    app.controller('loginCtrl', ['$scope', 'taskHandler', function ($scope, taskHandler) {
        $scope.login = function (email, password) { // there should be no argumenrs here
            // taskHandler.login($scope.email, $scope.password)
            taskHandler.login(email, password)
                .then(function (response) {
                    var myLoginForm = document.getElementById("login");
                    myLoginForm.style.display = "none";
                    token = response.data.token;
                    document.dispatchEvent(loggedIn);
                }, function (e) {
                    console.log(e);
                    alert("Something went wrong check console!");
                });
        };
        // the part below should be eventually removed
        console.log("trying to");
        $scope.login("admin@mail.com", "123456");
    }]);

    app.controller('taskCtrl', function ($scope, taskHandler, tasksStorage) {
        
        document.addEventListener('login_success', function (e) {

            var tasksView = document.getElementsByClassName("tasks");
            tasksView[0].style.display = "unset";

            // we are updating tasks view if the background tasks have changed
            $scope.$watch(
                function () {
                    return tasksStorage.getTasks();
                },
                function (newValue, oldValue) {
                    if (newValue !== oldValue) $scope.tasks = newValue;
                });

            // links.push({ target: 0, source: 1 });
            taskHandler.getTasks(token)
                .then(function (response) {
                    tasksStorage.setTasks(response.data.task);
                    
                    response.data.task.forEach(task => {
                        // we are adding the task and also link it to other tasks
                        myGraph.add({ id: task._id, label: task.name }, function(links){
                            task.parents.forEach(parent => {
                                links.push({ target: parent, source: task._id });
                            });
                        });
                    });
                }, function (response) {
                    console.log(response.data);
                    alert("Something Went Wrong in pulling tasks for the user");
                });

        }, false);

        $scope.createTask = function (type, task) {
            let eventPayload = (task) ? { type: type, task: task } : { type: type };
            document.dispatchEvent(new CustomEvent('modal_event', { detail: eventPayload }));
        };
    });

    /// This controller is only responsible for showing tasks
    /// Ideally we should pass in the data that it needs to display and it should not be doing any computations
    app.controller('modalCtrl', function ($scope, taskHandler, tasksStorage) {
        let createTaskModal = document.getElementById("createTaskModal");
        let dimmer = document.getElementById("dimmer");

        function hideModal() {
            createTaskModal.style.display = "none"; // we are going to show our modal now
            dimmer.style.display = "none";
        }

        document.addEventListener('modal_event', function (e) {
            $scope.modal_type = e.detail.type;
            
            if (e.detail.type == "update_task") {
                $scope.task_to_modify = e.detail.task;
            }
            else {
                $scope.task_to_modify = {};
                $scope.task_to_modify.name = "enter new task name";
            }

            $scope.tasks = tasksStorage.getTasks(); // TODO: We need to update tasks periodically
            createTaskModal.style.display = "unset"; // we are going to show our modal now
            dimmer.style.display = "unset";
        });

        $scope.createNewTask = function () {
            taskHandler.createNewTask(token, {
                name: $scope.task_to_modify.name,
                parents: $scope.task_to_modify.parent_tasks
            });

            // we are updating task list
            taskHandler.getTasks(token)
                .then(function (response) {
                    tasksStorage.setTasks(response.data.task);
                    $scope.cancel();
                }, function (response) {
                    console.log(response.data);
                    alert("Something Went Wrong in pulling tasks for the user");
                });
        }

        $scope.cancel = function () {
            hideModal();
        };

        /**
         * TODO: Need to make sure that parent tasks that this element already hasnpm start are underlined in select
         */
        $scope.updateTask = function () {
            let task = $scope.task_to_modify;
            taskHandler.updateTask(token, task._id, task).then(
                function () {
                    myGraph.update(task._id, task.name);
                },
                function () {
                    alert("Update failed for some reason");
                });
            hideModal();
        };

        $scope.deleteTask = function () {
            taskHandler.deleteTask(token, $scope.task_to_modify._id).then(
                function (res) {
                    //we update tasks in the list
                    taskHandler.getTasks(token).then(
                        function (res) {
                            tasksStorage.setTasks(res.data.task);
                        },
                        function (err) {
                            alert(err);
                        }
                    );
                    tasksStorage.setTasks(tasks);
                    hideModal();
                },
                function (err) {
                    console.log(err);
                    alert(err);
                }
            );
        };

    });

})();