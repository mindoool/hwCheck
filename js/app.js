var app = angular.module('HwCheck', ['ngMaterial','ngMessages','ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('login', {
            url:'/login',
            templateUrl: 'templates/login.html',
            controller: "LoginController"
        })
        .state('index', {
            url:'/',
            templateUrl: 'templates/index.html',
            controller: "HwListController",
            authenticate: true
        })
        .state('admin', {
            url:'/admin',
            templateUrl: 'templates/admin.html',
            controller: "AdminController",
            authenticate: true
        });
});

app.run(function($http, storage, $rootScope, $state) {
    $http.defaults.headers.common.Authorization = storage.get('token');
    $rootScope.token = storage.get('token');
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        // 이동할 페이지에 authenticate 값이 있는지 확인해서 라우팅한다.
        if( toState.authenticate ){
            $state.go('index');
            event.preventDefault();
        }

    });
    $rootScope.logout = function () {
        console.log('logout');
        console.log($rootScope);
        $rootScope.token = null;
        $http.defaults.headers.common.Authorization = null;
        $state.go('login');
    }
});