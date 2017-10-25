// TODO:
/*
After the user logs in we are going to hide login menue and we are going to let him add and delete nodes
on the transperent canvas
*/

(function () {
    var loggedIn = new Event('login_success', { data: "hello" });
    var openCreateModal = new Event('create_task');
    var token;
    var tasks;

    var app = angular.module('app', []);

    app.controller('loginCtrl', ['$scope', 'taskHandler', function ($scope, taskHandler) {
        $scope.login = function () {
            taskHandler.login($scope.email, $scope.password)
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
    }]);

    app.controller('taskCtrl', function ($scope, taskHandler) {
        document.addEventListener('login_success', function (e) {

            var tasksView = document.getElementsByClassName("tasks");
            console.log(tasksView);
            tasksView[0].style.display = "unset";

            taskHandler.getTasks(token)
                .then(function (response) {
                    console.log(response.data.task);
                    $scope.tasks = response.data.task;
                    tasks = response.data.task;
                    console.log(tasks);
                }, function (response) {
                    console.log(response.data);
                    alert("Something Went Wrong in pulling tasks for the user");
                });

        }, false);

        $scope.createTask = function () {
            document.dispatchEvent(openCreateModal); // we are telling to show create task modal
        };

        $scope.updateTask = function () {
            console.log($scope.parents);
        };
    });

    app.controller('modalCtrl', function ($scope, taskHandler) {
        var createTaskModal = document.getElementById("createTaskModal");
        var dimmer = document.getElementById("dimmer");
        $scope.cancel = function () {
            createTaskModal.style.display = "none"; // we are going to show our modal now
            dimmer.style.display = "none";
        };

        document.addEventListener('create_task', function (e) {
            $scope.tasks = tasks;
            createTaskModal.style.display = "unset"; // we are going to show our modal now
            dimmer.style.display = "unset";
        });

        $scope.createNewTask = function () {
            taskHandler.createNewTask(token, {
                name: $scope.task_name,
                parents: $scope.parent_tasks
            });
        }
    });

})();