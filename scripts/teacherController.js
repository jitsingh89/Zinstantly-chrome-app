define(['zinstantlyApp'], function (zinstantlyApp) {
zinstantlyApp.controller('zTeacherCtrl', ['$scope', '$http', '$window','teacherService', function ($scope,$http,$window,teacherService) {

 $scope.questions = [];
 $scope.question = null;
 $scope.editMode = false;
 
 //get User
 $scope.get = function () {
 $scope.question = this.question;
 };
 
 // initialize your question data
 (function () {
 questionService.getQuestionList().success(function (data) {
 $scope.questions = data;
 }).error(function (data) {
   $scope.error = "An Error has occured while Loading question! " + data.ExceptionMessage;
 });
 })();
 
 
 // add Question
 $scope.AddQuestion = function () {
   var currentQuestion = this.question;
   if (currentQuestion != null && currentQuestion.Name != null && currentQuestion.Address && currentQuestion.ContactNo) {
     teacherService.addQuestion(currentQuestion).success(function (data) {
       $scope.addMode = false;
       currentQuestion.UserId = data;
       $scope.questions.push(currentQuestion);
     });
   }
 };
}]);
});