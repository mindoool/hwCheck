app.controller('UserController', ['$scope', 'storage', '$mdMedia', '$mdDialog', '$http', '$filter', function ($scope, storage, $mdMedia, $mdDialog, $http, $filter) {

    //userGroup불러오기
    $scope.userGroupList = [];

    $scope.groupList = [];

    $scope.selectedCourse = null;
    $scope.targetGroup = 0;
    $scope.courseObj = {};
    $scope.groupObj = {};

    $scope.getUserGroupList = function () {
        var params = {
            userId:0,
            groupId:0
        };
        $http.get(host+"/user-group-relations", {params: params}, {cache: true})
            .then(function(response) {
                console.log(response);
                $scope.userGroupList = response.data.data;
                for (var i = 0; i < $scope.userGroupList.length; i++) {
                    var course = $scope.userGroupList[i].course;
                    var group = $scope.userGroupList[i].group;
                    var user = $scope.userGroupList[i].user;

                    if (typeof $scope.courseObj[course.id]=="undefined") {
                        if (typeof $scope.groupObj[group.id]=="undefined") {
                            $scope.groupObj={};
                            group.users = [user];
                            $scope.groupObj[group.id] = group;
                            console.log('1')
                        } else {
                            $scope.groupObj[group.id].users.push(user);
                            console.log('2')
                        }
                        course.groups = [$scope.groupObj];
                        $scope.courseObj[course.id] = course;
                        console.log(course);
                    } else {
                        if (typeof $scope.groupObj[group.id]=="undefined") {
                            group.users = [user];
                            $scope.groupObj[group.id] = group;
                            console.log('3')
                        } else {
                            $scope.groupObj[group.id].users.push(user);
                            console.log('4')
                        }
                        //$scope.courseObj[course.id].groups.push($scope.groupObj);
                        console.log(course);
                    }
                }
                console.log($scope.courseObj);
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