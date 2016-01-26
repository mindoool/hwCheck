app.controller('LoginController', ['$scope', '$mdDialog', '$mdMedia', '$http', 'storage', '$state', '$rootScope', function ($scope, $mdDialog, $mdMedia, $http, storage, $state, $rootScope) {
    $scope.data = [];

    $scope.user = {
        email: "",
        password: ""
    };

    $scope.login = function () {
        console.log('hi');
        $http.post(host+'/users/login', $scope.user)
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
            passwordCheck:"",
            name:"",
            groupId:""
        };

        //$scope.getGroupId = function(id) {
        //    console.log(id);
        //    $scope.user.groupId = id
        //};

        $scope.selectedGroup='';
        $scope.groupList = [];

        $http.get(host+"/courses/0/groups")
            .then(function (response) {
                console.log(response);
                $scope.groupList = response.data.data
            });

        $scope.signup = function () {
            var userData = {
                email: $scope.user.email,
                password: $scope.user.password,
                name: $scope.user.name,
                groupId: $scope.user.groupId
            };
            console.log($scope.user.groupId);
            $http.post(host+'/users', userData)
                .then(function(response) {
                    console.log(response);
                    $scope.hide()
                })
        }
    }
}]);