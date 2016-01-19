app.controller('LoginController',['$scope','$mdDialog', '$mdMedia', '$http', 'storage','$state','$rootScope', function($scope, ApiService, $mdDialog, $mdMedia, $http, storage, $state, $rootScope ){
    $scope.data = [];

    $scope.user = {
        email:"",
        password:""
    };

    $scope.login = function () {
        console.log('hi');
        $http.post('http://localhost:12080/api/users/login', $scope.user)
            .then(function(response) {
                storage.set('token', response.data.token);
                $scope.$root.token = response.data.token;
                $http.defaults.headers.common.Authorization = storage.get('token');
                $state.go('index');
            });
    };

    $scope.status = '  ';
    //$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.showAdvanced = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'templates/signup.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };
    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
        $scope.user = {
            email:"",
            password:"",
            passwordCheck:""
        };
        $scope.signUp = function() {
            var userData = {
                email:$scope.user.email,
                password:$scope.user.password
            };
            $http.post('http://localhost:12080/api/users',userData)
                .then(function(response) {
                    console.log(response)
                    $scope.hide()
                });
        };
    }
}]);