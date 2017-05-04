app.directive('profile', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/profile.html',
        controller: "AppController"
    }
});

app.directive('index', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/index.html',
        controller: "LoggedController"
    }
});

app.directive('news', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/news.html'
    }
});