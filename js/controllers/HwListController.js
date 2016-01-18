app.controller('HwListController', ['$scope', 'storage','$mdMedia', function ($scope, storage, $mdMedia) {
    $scope.hwList = storage.get('hwList') || [];

    //서버에서 과제목록을 받아오는 함수
    $scope.getHwList = function () {
        $http.get('http://localhost:12080/api/hws', $scope.user)
            .then(function(response) {
                storage.set('hwList', response.data.hwList);
                $scope.hwList = response.data.hwList;
            });
    };

    $scope.status = '  ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


    //제출하기 버튼을 누르면 새로운 창을 띄워 과제를 입력하도록 하는 함수
    $scope.doHw = function(hw) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
            controller: HwContentController,
            templateUrl: 'templates/hw-content.html',
            parent: angular.element(document.body),
            targetEvent: hw,
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

    function HwContentController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
        $scope.hwContent = {
            name:"",
            date:"",
            content:""
        };

        //과제 입력후 제출하기 버튼을 누르면 서버에 데이터 전송하는 함수
        $scope.submit = function() {
            var hwData = {
                name:$scope.hwContent.name,
                date:$scope.hwContent.date,
                content:$scope.hwContent.content
            };
            $http.post('http://localhost:12080/api/do-hw',hwData)
                .then(function(response) {
                    console.log(response);
                    $scope.hide()
                });
        };
    }


}]);