// TODO:
/*
After the user logs in we are going to hide login menue and we are going to let him add and delete nodes
on the transperent canvas
*/

(function () {
    var app = angular.module('app', []);
    app.controller('loginCtrl', function ($scope, $http) {
        $scope.update = function (user) {
            console.log(user);
            $http.post(
                '/api/users/auth',
                { email: user.email, password: user.password }
            ).then(function successCallback(response) {
                console.log(response);
                //TODO: We need to hifr login page
            }, function errorCallback(response) {
                console.log(response.data);
                alert("Something Went Wrong");
            });
        }
    });
})();