app.controller('AppController', function ($scope) {
    $scope.init = function (data) {
        return JSON.parse(data);
    };
});


app.controller('NewsController', function ($scope, $http) {
    $http.get('/api/news/').then(function (data) {
        $scope.news = data.data;
    });
});

app.controller('LoggedController', function ($scope, $http) {
    $http.get('/isLoggedIn').then(function (usr) {
        let user = usr.data;
        if (user!=='0') $scope.logged = user;
        else $scope.logged = false;
    });
});

