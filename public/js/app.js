// TODO:
/*
After the user logs in we are going to hide login menue and we are going to let him add and delete nodes
on the transperent canvas
*/

(function () {
    var loggedIn = new Event('login_success', { data: "hello" });
    var token;
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
                console.log("Here");
                console.log(response);
                $scope.tasks = response.data.task;

            }, function errorCallback(response) {
                console.log(response.data);
                alert("Something Went Wrong in pulling tasks for the user");
            });

        }, false);

        $scope.openCreationMenue = function () {
            $scope.openedCreationMenue = !$scope.openedCreationMenue;
        };

        $scope.updateTask = function () {
            console.log($scope.precedent);
        };
    });

})();