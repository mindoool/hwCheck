app.controller('LoginController', ['$scope', '$mdDialog', '$mdMedia', '$http', 'storage', '$state', '$rootScope', function ($scope, $mdDialog, $mdMedia, $http, storage, $state, $rootScope) {
    $scope.data = [];

    $scope.user = {
        email: "",
        password: ""
    };

    $scope.login = function () {
        console.log('hi');
        $http.post('http://localhost:12080/api/users/login', $scope.user)
            .then(function (response) {
                storage.set('token', response.data.token);
                $scope.$root.token = response.data.token;
                $http.defaults.headers.common.Authorization = storage.get('token');
                $state.go('index');
            });
    };


    //과제를 출제하기 위해 호출하는 함수
    $scope.signupDialog = function (event) {
        $mdDialog.show({
            controller: SignupController,
            templateUrl: 'templates/signup.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: true
        })
    };

    function SignupController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function () {
            $mdDialog.hide(answer);
        };

        $scope.user = {
            email:"",
            password:"",
            passwordCheck:""
        };

        $scope.signup = function () {
            var userData = {
                email: $scope.user.email,
                password: $scope.user.password
            };
            $http.post('http://localhost:12080/api/users', userData)
                .then(function(response) {
                    console.log(response);
                    $scope.hide()
                })
        }
    }


    //$scope.signupDialog = function (user) {
    //    $mdDialog.show({
    //        controller: SignupController,
    //        templateUrl: 'templates/signup.html',
    //        parent: angular.element(document.body),
    //        targetEvent: user,
    //        clickOutsideToClose: true,
    //        fullscreen: true
    //    })
    //};
    //
    //function SignupController($scope, $mdDialog) {
    //    $scope.hide = function () {
    //        $mdDialog.hide();
    //    };
    //    $scope.cancel = function () {
    //        $mdDialog.cancel();
    //    };
    //    $scope.answer = function (answer) {
    //        $mdDialog.hide(answer);
    //    };
    //
    //    //서버에 개별과제를 보내는 http.post 추가되어야 함
    //    $scope.hwFormat = {
    //        course: "",
    //        name: "",
    //        date: new Date(),
    //        content: ""
    //    };
    //
    //    $scope.items = [];
    //
    //    $scope.user = {
    //        email: "",
    //        password: "",
    //        passwordCheck: ""
    //    };
    //
    //    $scope.signUp = function () {
    //        var userData = {
    //            email: $scope.user.email,
    //            password: $scope.user.password
    //        };
    //        $http.post('http://localhost:12080/api/users', userData)
    //            .then(function (response) {
    //                console.log(response);
    //                $scope.hide()
    //            });
    //    };
    //
    //    //$scope.selectedCourse='';
    //    //$scope.courseList = ['수학1/2', '미적분1', '미적분2', '확률과통계'];
    //
    //}
}]);