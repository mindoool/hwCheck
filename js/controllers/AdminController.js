app.controller('AdminController', ['$scope', 'storage', '$mdMedia', '$mdDialog', '$http', '$filter', function ($scope, storage, $mdMedia, $mdDialog, $http, $filter) {

    //문제목록 불러올 때 필터링 기준 - course 기준

    $scope.courseList = [];
    $scope.targetCourse = "";

    //course 불러오기
    $scope.getCourse = function () {
        $http.get(host+"/courses")
            .then(function (response) {
                console.log(response);
                $scope.courseList = response.data.data
            });
    };

    $scope.getCourse();


    //과정 생성하는 함수
    $scope.createCourse = function (course) {
        $mdDialog.show({
            controller: CourseController,
            templateUrl: 'templates/create-course.html',
            parent: angular.element(document.body),
            targetEvent: course,
            clickOutsideToClose: true,
            fullscreen: true,
            scope:$scope,
            course: course
        })
    };

    function CourseController($scope, $mdDialog, course) {
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
        $scope.course = {
            name:""
        };

        $scope.currentCourse = {
            name:course.name
        };

        $scope.makeCourse = function () {
            var courseData = {
                name: $scope.course.name
            };
            $http.post(host+'/courses', courseData)
                .then(function(response) {
                    console.log(response);
                    $scope.cancel();
                    $scope.getCourse()
                })
        };

        $scope.editCourse = function () {
            var courseData = {
                name: $scope.currentCourse.name
            };
            $http.put(host+"/courses/"+course.id, courseData)
                .then(function(response) {
                    console.log(response);
                    $scope.cancel();
                    $scope.getCourse()
                });
        }
    }


    //과정 수정하는 함수
    $scope.editCourse = function (event, course) {
        $mdDialog.show({
            controller: CourseController,
            templateUrl: 'templates/edit-course.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: true,
            scope:$scope,
            locals: {
                course: course
            }
        })
    };


    //과정 삭제
    $scope.deleteCourse = function(id) {
        console.log('delete');
        $http.delete(host+"/courses/"+id)
            .then(function (response) {
                console.log(response);
                $scope.getCourse()
            });
    };


    //문제목록 불러오는 거
    $scope.datepicker = {
        "date1":new Date(),
        "date2":new Date()
    };

    $scope.dateList = [];
    $scope.groupList = [];

    $scope.getHwList = function () {
        var params = {
            "date1":$filter('date')(new Date($scope.datepicker.date1), 'yyyy-MM-dd'),
            "date2":$filter('date')(new Date($scope.datepicker.date2), 'yyyy-MM-dd'),
            "group":$scope.targetCourse.trim()
        };
        $http.get(host+"/problems", {params: params})
            .then(function (response) {
                console.log(response.data.data);
                console.log($scope.datepicker.date2);
                console.log(new Date($scope.datepicker.date2));
                console.log(params);
                $scope.problemList = response.data.data;
                for(var i = 0; i < $scope.problemList.length; i++) {
                    if($scope.dateList.indexOf($scope.problemList[i].date)<0) {
                        $scope.dateList.push($scope.problemList[i].date);
                    }
                }
                for(var i = 0; i < $scope.problemList.length; i++) {
                    if($scope.groupList.indexOf($scope.problemList[i].group.name)<0) {
                        $scope.groupList.push($scope.problemList[i].group.name);
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

        $scope.selectedCourse='';
        $scope.courseList = ['수학1/2', '미적분1', '미적분2', '확률과통계'];

        $scope.giveHwSubmit = function () {
            var content = {
                content: $scope.fileContent
            };
            $http.post(host+'/problems', content)
                .then(function(response) {
                    $scope.hide()
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