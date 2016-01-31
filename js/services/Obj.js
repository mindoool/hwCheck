app.service('Obj', [function () {
    var rootGroupObj = {};
    var rootCourseObj = {};

    this.setGroupObj = function(groupObj) {
        rootGroupObj = groupObj;
    };

    this.getGroupObj = function() {
        return rootGroupObj;
    };

    this.setCourseObj = function(courseObj) {
        rootCourseObj = courseObj;
    };

    this.getCourseObj = function() {
        return rootCourseObj;
    };
}]);