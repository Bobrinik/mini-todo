// TODO:
/*
After the user logs in we are going to hide login menue and we are going to let him add and delete nodes
on the transperent canvas
*/

(function () {
    var app = angular.module('app', []);
    app.controller('loginCtrl', function ($scope, $http) {
        $scope.openedCreationMenue = false;
        $scope.active = false;
        $scope.token = false;

        $scope.login = function () {
            $http.post(
                '/api/users/auth',
                { email: $scope.email, password: $scope.password }
            ).then(function successCallback(response) {
                console.log(response);
                $scope.token = response.data.token;
                loadTasks();
            }, function errorCallback(response) {
                console.log(response.data);
                alert("Something Went Wrong");
            });
        };

        function loadTasks() {
            $http.get(
                '/api/tasks/',
                { headers: { 'Authorization': "Bearer " + $scope.token } }
            ).then(function successCallback(response) {
                console.log(response);
                $scope.tasks = response.data.task;
            }, function errorCallback(response) {
                console.log(response.data);
                alert("Something Went Wrong in pulling tasks for the user");
            });
        }

        $scope.openCreationMenue = function () {
            $scope.openedCreationMenue = !$scope.openedCreationMenue;
        };

        $scope.updateTask = function () {
            console.log($scope.precedent);
        };
    });
})();