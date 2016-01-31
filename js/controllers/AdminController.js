app.controller('AdminController', ['$scope', 'storage', '$mdMedia', '$mdDialog', '$http', '$filter', function ($scope, storage, $mdMedia, $mdDialog, $http, $filter) {

    //문제목록 불러올 때 필터링 기준 - course 기준

    $scope.groupList = [];

    $scope.selectedCourse = null;
    $scope.targetGroup = 0;
    $scope.courseObj = {};


    //group 불러오기
    $http.get(host + "/courses/0/groups", {cache: true})
        .then(function (response) {
            console.log(response);
            $scope.groupList = response.data.data;
            for (var i = 0; i < $scope.groupList.length; i++) {
                var course = $scope.groupList[i].course;

                if (typeof $scope.courseObj[course.id]=="undefined") {
                    course.groups = [$scope.groupList[i]];
                    $scope.courseObj[course.id] = course;
                } else {
                    $scope.courseObj[course.id].groups.push($scope.groupList[i]);
                }
            }
            console.log($scope.courseObj);
        });

    //문제목록 불러오는 거
    $scope.datepicker = {
        "date1": new Date(),
        "date2": new Date()
    };

    $scope.dateObj = {};
    $scope.groupObj = {};
    $scope.problemObj = {};

    $scope.getHwList = function () {
        var params = {
            "date1": $filter('date')(new Date($scope.datepicker.date1), 'yyyy-MM-dd'),
            "date2": $filter('date')(new Date($scope.datepicker.date2), 'yyyy-MM-dd'),
        };
        $http.get(host + "/groups/" + $scope.targetGroup + "/problems", {params: params}, {cache: true})
            .then(function (response) {
                $scope.dateList = [];
                $scope.problemGroupList = [];
                $scope.problemList = response.data.data;

                for (var i = 0; i < $scope.problemList.length; i++) {
                    if ($scope.dateList.indexOf($scope.problemList[i].date) < 0) {
                        $scope.dateList.push($scope.problemList[i].date);
                    }
                }

                //for (var i = 0; i < $scope.problemList.length; i++) {
                //    var date = $scope.problemList[i].date;
                //    var group = $scope.userGroupList[i].group;
                //
                //    if (typeof $scope.groupObj[group.id]=="undefined") {
                //        if (typeof $scope.courseObj[course.id]=="undefined") {
                //            $scope.courseObj={};
                //            course.users = [user];
                //            $scope.courseObj[course.id] = course;
                //            console.log('1')
                //        } else {
                //            $scope.courseObj[course.id].users.push(user);
                //            console.log('2')
                //        }
                //        group.courses = [$scope.courseObj];
                //        $scope.groupObj[group.id] = group;
                //        console.log(group);
                //    } else {
                //        if (typeof $scope.courseObj[course.id]=="undefined") {
                //            course.users = [user];
                //            $scope.courseObj[course.id] = course;
                //            console.log('3')
                //        } else {
                //            $scope.courseObj[course.id].users.push(user);
                //            console.log('4')
                //        }
                //        //$scope.courseObj[course.id].groups.push($scope.groupObj);
                //        console.log(group);
                //    }
                //}

                for (var i = 0; i < $scope.problemList.length; i++) {
                    if ($scope.problemGroupList.indexOf($scope.problemList[i].group.name) < 0) {
                        $scope.problemGroupList.push($scope.problemList[i].group.name);
                    }
                }
            });
    };

    $scope.getHwList();


    //과제를 출제하기 위해 호출하는 함수
    $scope.giveHw = function (hw) {
        $mdDialog.show({
            controller: HwFormatController,
            templateUrl: 'templates/hw-format.html',
            scope: $scope,
            preserveScope: true,
            parent: angular.element(document.body),
            targetEvent: hw,
            clickOutsideToClose: true,
            fullscreen: true
        })
    };

    function HwFormatController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };


        $scope.items = [];

        $scope.fileContent = null;

        $scope.giveHwSubmit = function () {
            var content = {
                content: $scope.fileContent
            };
            console.log($scope.fileContent);
            $http.post(host + '/problems', content)
                .then(function (response) {
                    $scope.hide();
                    console.log(response)
                })
        };

        //변화감지하는 함수
        //$scope.$watch(function() {
        //    return $scope.fileContent;
        //}, function(newVal, oldVal) {
        //   console.log(newVal);
        //});
    }


    //결과 확인을 누르면 개별 결과를 볼 수 있는 함수
    $scope.getHw = function (hw) {
        $mdDialog.show({
            controller: HwResultController,
            templateUrl: 'templates/hw-result.html',
            parent: angular.element(document.body),
            targetEvent: hw,
            clickOutsideToClose: true,
            fullscreen: true
        })
    };

    function HwResultController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

        //서버로 부터 개별과제 받아오는 http.get이 추가되어야 함
        $scope.hwResult = {
            name: "",
            date: "",
            content: ""
        };

        $scope.userAnswer = '';
        $scope.answerList = ['맞음', '틀렸는데 고침', '틀렸는데 모름', '모름'];


    }

}]);