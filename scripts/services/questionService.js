 
angular.module("zinstantlyApp.Question",[])
.factory('questionService', function ($http) {
 var serviceurl = "";
 return {
     getQuestionList: function () {
       var url = serviceurl + "GetUsersList";
       return $http.get(url);
     },
     getQuestion: function (question) {
       var url = serviceurl + "GetUser/" + question.UserId;
       return $http.get(url);
     },
     addQuestion: function (qopt) {
       var url = serviceurl + "AddUser";
       var QuestionBank = Parse.Object.extend("QuestionBank");
       var questionBank = new QuestionBank();
        
        questionBank.set("options",  qopt.options);
        questionBank.set("question_title", qopt.question);
        questionBank.set("teacher",  qopt.email);
        
        questionBank.save(null, {
          success: function(questionBank) {
            // Execute any logic that should take place after the object is saved.
            console.log('New object created with objectId: ' + questionBank.id);
            return questionBank.id;
          },
          error: function(questionBank, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log('Failed to create new object, with error code: ' + error.message);
             return 0;
          }
        });
     return 0;
     },
     deleteQuestion: function (question) {
       var url = serviceurl + "DeleteUser/" + question.UserId;
       return $http.delete(url);
     },
     updateQuestion: function (question) {
       var url = serviceurl + "ModifyUser/" + question.UserId;
       return $http.put(url, question);
     }
   };
});