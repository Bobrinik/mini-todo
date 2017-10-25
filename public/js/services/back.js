angular.module("app")
    .factory("taskHandler", function taskHandlerFactory($http) {

        return {
            login: function (email, password) {
                return $http.post('/api/users/auth', { email: email, password: password });
            },

            getTasks: function (token) {
                return $http.get('/api/tasks', { headers: { 'Authorization': "Bearer " + token } });
            },

            createNewTask: function (token, body) {
                return $http.post('/api/tasks', body, { headers: { 'Authorization': "Bearer " + token } });
            }

        };
    });