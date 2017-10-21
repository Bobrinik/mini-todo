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

    app.controller('loginCtrl', function ($scope, $http) {
        $scope.login = function () {
            $http.post(
                '/api/users/auth',
                { email: $scope.email, password: $scope.password }
            ).then(function successCallback(response) {
                var myLoginForm = document.getElementById("login");
                myLoginForm.style.display = "none";
                token = response.data.token;

                document.dispatchEvent(loggedIn);
            }, function errorCallback(response) {
                console.log(response.data);
                alert("Something Went Wrong");
            });
        };
    });

    app.controller('taskCtrl', function ($scope, $http) {
        document.addEventListener('login_success', function (e) {
            var tasks = document.getElementsByClassName("tasks");
            console.log(tasks);
            tasks[0].style.display = "unset";

            $http.get(
                '/api/tasks/',
                { headers: { 'Authorization': "Bearer " + token } }
            ).then(function successCallback(response) {
                console.log(response);
                $scope.tasks = response.data.task;
                tasks = response.data.task;

            }, function errorCallback(response) {
                console.log(response.data);
                alert("Something Went Wrong in pulling tasks for the user");
            });

        }, false);

        $scope.createTask = function () {
            document.dispatchEvent(openCreateModal); // we are telling to show create task modal
        };

        $scope.updateTask = function () {
            console.log($scope.precedent);
        };
    });

    app.controller('modalCtrl', function ($scope) {
        var createTaskModal = document.getElementById("createTaskModal");
        var dimmer = document.getElementById("dimmer");

        this.tasks = tasks;
        
        $scope.cancel = function () {
            createTaskModal.style.display = "none"; // we are going to show our modal now
            dimmer.style.display = "none";
        };

        document.addEventListener('create_task', function (e) {
            createTaskModal.style.display = "unset"; // we are going to show our modal now
            dimmer.style.display = "unset";
        });
    });

})();