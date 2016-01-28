app.controller('UserController', ['$scope', 'storage', '$mdMedia', '$mdDialog', '$http', '$filter', function ($scope, storage, $mdMedia, $mdDialog, $http, $filter) {

    //문제목록 불러올 때 필터링 기준 - course 기준

    $scope.userList = [];

    //유저목록 불러오기
    $scope.getUser = function () {
        $http.get(host+"/users", {cache: true})
            .then(function (response) {
                console.log(response);
                $scope.userList = response.data.data
            });
    };

    $scope.getUser();

    $scope.userGroupList = [];

    $scope.getUserGroupList = function () {
        var params = {
            userId:0,
            groupId:0
        };
        $http.get(host+"/user-group-relations", {params: params}, {cache: true})
            .then(function(response) {
                console.log(response);
                $scope.userGroupList = response.data.data;
            });
    };

    $scope.getUserGroupList();

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
                    $scope.hide();
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
                    $scope.hide();
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


}]);