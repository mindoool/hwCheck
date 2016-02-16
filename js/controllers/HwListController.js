app.controller('HwListController', ['$scope', 'storage','$mdMedia', '$mdDialog','$http','$rootScope', '$filter', function ($scope, storage, $mdMedia, $mdDialog, $http, $rootScope, $filter) {
    //서버에서 과제목록을 받아오는 함수
    $scope.getHwList = function () {
        $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var params = {
            "userId": $rootScope.user.id
        };
        $http.get('http://localhost:12080/api/user-homework-relations', {params:params})
            .then(function(response) {
                console.log(response);
                $scope.hwList = response.data.data;
            });
    };
    $scope.getHwList();

    //제출하기 버튼을 누르면 새로운 창을 띄워 과제를 입력하도록 하는 함수
    $scope.doHw = function(ev, homework) {
        $mdDialog.show({
            controller: HwContentController,
            templateUrl: 'templates/hw-content.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen:true,
            scope: $scope,
            preserveScope: true,
            locals: {
                homework: homework
            }
        })
    };

    function HwContentController($scope, $mdDialog, homework) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
        $scope.userAnswer='';
        $scope.answerOptions = ['맞음', '틀렸는데 고침', '틀렸는데 모름', '모름'];
        $http.get(host + "/homeworks/"+homework.id+"/problems")
            .then(function (response) {
                $scope.problemList = response.data.data.problems;
                $scope.homeworkObj = response.data.data.homework;
                for (var i=0; i < $scope.problemList.length; i++) {
                    $scope.problemList[i]['answer'] = "";
                };
                console.log($scope.problemList);
            });

        //과제 입력후 제출하기 버튼을 누르면 서버에 데이터 전송하는 함수
        $scope.submit = function() {
            console.log($scope.problemList);
            var answers = {
                problemAnswers : $scope.problemList,
                homeworkId : homework.id
            };
            $http.post(host+"/answers", answers)
                .then(function(response) {
                    console.log(response);
                    $scope.hide()
                });
        };
    }

}]);