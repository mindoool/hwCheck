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

                    if (typeof $scope.groupObj[group.id]=="undefined") {
                        if (typeof $scope.courseObj[course.id]=="undefined") {
                            $scope.courseObj={};
                            course.users = [user];
                            $scope.courseObj[course.id] = course;
                            console.log('1')
                        } else {
                            $scope.courseObj[course.id].users.push(user);
                            console.log('2')
                        }
                        group.courses = [$scope.courseObj];
                        $scope.groupObj[group.id] = group;
                        console.log(group);
                    } else {
                        if (typeof $scope.courseObj[course.id]=="undefined") {
                            course.users = [user];
                            $scope.courseObj[course.id] = course;
                            console.log('3')
                        } else {
                            $scope.courseObj[course.id].users.push(user);
                            console.log('4')
                        }
                        //$scope.courseObj[course.id].groups.push($scope.groupObj);
                        console.log(group);
                    }
                }
                console.log($scope.groupObj);
            });
    };

    $scope.getUserGroupList();

    //유저의 반을 수정하는 함수
    $scope.editUserDialog = function (event, obj, id) {
        $mdDialog.show({
            controller: UserController,
            templateUrl: 'templates/edit-user.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: true,
            scope:$scope,
            preserveScope: true,
            locals: {
                obj: obj,
                id: id
            }
        })
    };

    function UserController($scope, $mdDialog, obj, id) {
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

        $scope.currentUser = {
            name:obj.name
        };

        $scope.dialogGroupObj = obj[id];

        $scope.editUser = function () {
            var userData = {
                name: $scope.currentUser.name
            };
            $http.put(host+"/users/"+user.id, userData)
                .then(function(response) {
                    console.log(response);
                    $scope.hide();
                    $scope.getCourse()
                });
        }
    }

}]);