app.controller('AdminController', ['$scope', 'storage','$mdMedia', '$mdDialog','$stateParams', function ($scope, storage, $mdMedia, $mdDialog, $stateParams) {
    $scope.hwList = storage.get('hwList') || [];

    $scope.targetCourse='';
    $scope.courseList = ['수학1/2', '미적분1', '미적분2', '확률과통계']

    //서버에서 과제목록을 받아오는 함수
    $scope.getHwList = function () {
        $http.get('http://localhost:12080/api/hws', $scope.user)
            .then(function(response) {
                storage.set('hwList', response.data.hwList);
                $scope.hwList = response.data.hwList;
            });
    };

    //과제를 출제하기 위해 호출하는 함수
    $scope.giveHw = function(hw) {
        $mdDialog.show({
            controller: HwFormatController,
            templateUrl: 'templates/hw-format.html',
            parent: angular.element(document.body),
            targetEvent: hw,
            clickOutsideToClose:true,
            fullscreen:true
        })
    };

    function HwFormatController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        //서버에 개별과제를 보내는 http.post 추가되어야 함
        $scope.hwFormat = {
            course:"",
            name:"",
            date:new Date(),
            content:""
        };

        $scope.items=[];

        //$scope.selectedCourse='';
        //$scope.courseList = ['수학1/2', '미적분1', '미적분2', '확률과통계'];

    }


    //결과 확인을 누르면 개별 결과를 볼 수 있는 함수
    $scope.getHw = function(hw) {
        $mdDialog.show({
            controller: HwResultController,
            templateUrl: 'templates/hw-result.html',
            parent: angular.element(document.body),
            targetEvent: hw,
            clickOutsideToClose:true,
            fullscreen:true
        })
    };

    function HwResultController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        //서버로 부터 개별과제 받아오는 http.get이 추가되어야 함
        $scope.hwResult = {
            name:"",
            date:"",
            content:""
        };

        $scope.userAnswer='';
        $scope.answerList = ['맞음', '틀렸는데 고침', '틀렸는데 모름', '모름'];


    }

}]);