app.controller('GroupController', ['$scope', 'storage', '$mdMedia', '$mdDialog', '$http', function ($scope, storage, $mdMedia, $mdDialog, $http) {
    //과정 생성하는 함수

    $scope.groupList = [];

    $scope.getGroup = function() {
        $http.get(host + "/courses/0/groups")
            .then(function (response) {
                console.log(response);
                $scope.groupList = response.data.data;
            });
    };

    $scope.getGroup();

    $scope.createGroupDialog = function (ev) {
        $mdDialog.show({
            controller: GroupDialogController,
            templateUrl: 'templates/create-group.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: true,
            scope:$scope,
            preserveScope : true,
            group: ev
        })
    };

    function GroupDialogController($scope, $mdDialog, group) {
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
        $scope.group = {
            name:"",
            courseId:""
        };

        $scope.currentGroup = group;
        console.log(group);

        $http.get(host + "/courses")
            .then(function (response) {
                console.log(response);
                $scope.courseList = response.data.data;
            });

        $scope.createGroup = function () {
            var groupData = {
                name: $scope.group.name
            };
            $http.post(host+'/courses/'+$scope.group.courseId+'/groups', groupData)
                .then(function(response) {
                    console.log(response);
                    $scope.getGroup();
                    $scope.hide();
                })
        };

        $scope.editCourse = function () {
            var courseData = {
                name: $scope.currentCourse.name
            };
            $http.put(host+"/courses/"+course.id, courseData)
                .then(function(response) {
                    console.log(response);
                    $scope.getCourse();
                    $scope.hide();
                });
        }
    }


    //과정 수정하는 함수
    $scope.editGroupDialog = function (event, group) {
        $mdDialog.show({
            controller: GroupDialogController,
            templateUrl: 'templates/edit-group.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: true,
            scope:$scope,
            preserveScope : true,
            locals: {
                group: group
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