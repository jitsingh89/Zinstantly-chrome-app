(function(){
Parse.initialize("Xuh7EnP1cjHyPhnyyLoSBvVNv8jiDrJmGTm1Q87l", "bTGQ7JecoARIo0Mw0wIV76HvJfTJ9RyDGtquT06Y");
angular.module('zinstantlyApp', ['zinstantlyApp.User','zinstantlyApp.Question'])
.controller('zAuthCtrl', ['$scope','$rootScope', '$http', '$window','userService','questionService', function ($scope,$rootScope,$http,$window,userService,questionService) {
var userInfo = "";
var userType="";
$rootScope.loginEmail="jitendra.singh@magicsw.com";

/*Student start */

$scope.student=[];
$scope.studentLst=[];
$scope.student.editMode=false;
$scope.student.btnEdit=false;

// initialize your student
(function () {
  var user = Parse.Object.extend("User");
  var query = new Parse.Query(user);
  query.equalTo("teacherid", $rootScope.loginEmail);
  query.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        $scope.studentLst.unshift({"userId":object.id , "email": object.get('email')});
      }
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
})();

 //create student 
  $scope.CreateStudent=function(){
    $("#divAddStudent").show(); 
    $scope.student=[];
    $scope.student.editMode = false;
    $scope.student.btnEdit=true;
 };
 
 //add student
  $scope.AddStudent=function(){
      if($scope.student.email !== undefined){
      userType="student";
     
      var user = new Parse.User();
      user.set("username", $scope.student.email);
      user.set("password", "singh");
      user.set("email",$scope.student.email);
      user.set("teacherid",$rootScope.loginEmail);
      user.set("usertype", userType);
      user.save(null, {
      success: function(user) {
         // return the success response
         console.log("Student Saved success!");
         $scope.student.userId=user.id;
         $scope.studentLst.unshift($scope.student);
         $scope.student=[];
       },
       error: function(user, error) {
              // return the error response
              console.log("Error: " + error.code + " " + error.message);
        }
     });
   }
  };
 //clear student 
  $scope.CancelStudent=function(){
     $scope.student=[];
     $("#divAddStudent").hide(); 
  };
  
   //Click event of edit student
  $scope.EditStudent=function(){
      $scope.student.editMode = false;
  };
  
  $scope.StudentClick=function(e){
      console.log(e);
      $scope.student.editMode = true;
      $scope.student.btnEdit=true;
      $scope.student.email=e.email;
        $("#divAddStudent").show(); 
  };
  
  
  /*Student End */
  
/* Teacher start*/
 $scope.questionsLst = [];
 $scope.question = [];
 $scope.question.options=[];
 $scope.question.editMode = false;
 $scope.question.btnEdit=true;


// initialize your question data
(function () {
  var QuestionBank = Parse.Object.extend("QuestionBank");
  var query = new Parse.Query(QuestionBank);
  query.equalTo("teacher", $rootScope.loginEmail);
  query.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
          $scope.questionsLst.unshift( {"questionId":object.id , "question": object.get('question_title'),"options":object.get('options')});
      }
     // $scope.questions.push(qopt.questions);
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
})();
 
 
  //Click event of Create Question
  $scope.CreateQuestion=function(){
      $("#divCreateQuestion").show();
      $scope.question=[];
      $scope.question.options=[];
      $scope.question.btnEdit=true;
      $scope.question.editMode = false;
  };
  
  //Click event of Cancel Question 
  $scope.CancelQuestion=function(){
     $("#divCreateQuestion").hide();
     $scope.question.editMode = false;
     $scope.question.btnEdit=true;
  };
  
  //Click event of edit Question 
  $scope.EditQuestion=function(){
    $scope.question.editMode = false;
  };
  
  $scope.QuestionClcik=function(e){
      console.log(e);
      $scope.question=[];
      $scope.question.options=[];
      $scope.question.editMode = true;
      $scope.question.btnEdit=false;
      $("#divCreateQuestion").show();
      $scope.question.questionId = e.questionId;
    
      $scope.question.question=e.question;
      $scope.question.options=e.options;
     
     
  };
  
  // add Question
 $scope.AddQuestion = function () {
     $scope.question.email="jitendra.singh@magicsw.com";
     if($("#rdoChoice1").prop("checked"))
     {
        $scope.question.options.push({"Correct":"correct","option": $scope.question.options.option1});
     }
     else
     {
        $scope.question.options.push({"Correct":"incorrect","option":$scope.question.options.option1});
     }
     if($("#rdoChoice2").prop("checked"))
     {
        $scope.question.options.push({"Correct":"correct","option":$scope.question.options.option2});
     }
     else
     {
        $scope.question.options.push({"Correct":"incorrect","option":$scope.question.options.option2});
     }
     if($("#rdoChoice3").prop("checked"))
     {
        $scope.question.options.push({"Correct":"correct","option":$scope.question.options.option3});
     }
     else
     {
        $scope.question.options.push({"Correct":"incorrect","option":$scope.question.options.option3});
     }
    if($("#rdoChoice4").prop("checked"))
     {
        $scope.question.options.push({"Correct":"correct","option":$scope.question.options.option4});
     }
     else
     {
        $scope.question.options.push({"Correct":"incorrect","option":$scope.question.options.option4});
     }
     $scope.questionsLst.unshift($scope.question); 
     if ($scope.question.question !== null && $scope.question.email !== null) {
       questionService.addQuestion($scope.question).success(function (data) {
           $scope.question.questionId = data;
 
       });
     }
     $scope.question = [];
     $scope.question.options=[];
 };
  
  /*Teacher End */
  
 /*User Start */
  // Goolgle+ login
  $scope.Login = function () {
    console.log("login click");
    Login();
  };
  
   //Teacher signup click
   $scope.TeacherSignUp=function(){
     console.log("Teacher click");
     userType="Teacher";
      Signup(userInfo);
   };
   
  //Student signup click
  $scope.StudentSignUp=function(){
       console.log("Student click");
       userType="Student";
       Signup(userInfo);
   };
  
  //Goolgle+  remove sesion event
  $scope.Logout = function () {
     console.log("LogOut click");
    LogOut();
  };
 
  function Login(){
     chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        } else {
          console.log('Token acquired:'+token+'.See chrome://identity-internals for details.');
           getUserInfo(true);
        }
      });
  }
  
  function LogOut(){
      chrome.identity.getAuthToken({ 'interactive': false }, function(current_token) {
      if (!chrome.runtime.lastError) {
        chrome.identity.removeCachedAuthToken({ token: current_token },
       function() {});
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
                 current_token);
        xhr.send();
        console.log('Token revoked and removed from cache. '+
          'Check chrome://identity-internals to confirm.');
        $("#divLogin").show();
        $("#divHome").hide();
    
       }
   });
  }
 
  function xhrWithAuth(method, url, interactive, callback) {
    var access_token;
    var retry = true;
    getToken();
    function getToken() {
      chrome.identity.getAuthToken({ interactive: interactive }, function(token) {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          return;
        }
        access_token = token;
        requestStart();
      });
    }

    function requestStart() {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      xhr.onload = requestComplete;
      xhr.send();
    }

    function requestComplete() {
      if (this.status == 401 && retry) {
        retry = false;
        chrome.identity.removeCachedAuthToken({ token: access_token },getToken);
      } else {
        callback(null, this.status, this.response);
      }
    }
  }
  
 //get user info   
  function getUserInfo(interactive) {
    xhrWithAuth('GET',
                'https://www.googleapis.com/plus/v1/people/me',
                interactive,
                onUserInfoFetched);
  }
  
  // fech user details
  function onUserInfoFetched(error, status, response) {
    if (!error && status == 200) {
   userInfo = JSON.parse(response);
   var username= "jitendra.singh@magicsw.com";
   var password="singh";
   
   var userQuery = new Parse.Query(Parse.User);
   userQuery.equalTo('username', username);
   userQuery.find({
        success: function(userObject) {
            if(userObject.length>0){
                $("#divLogin").hide();
                $("#divUserType").hide();
                $("#divHome").show();
            }
            else
            {
                $("#divLogin").hide();
                $("#divHome").hide();
                $("#divUserType").show();
            }
          $("#divName").html(userInfo.displayName);
          var xhr = new XMLHttpRequest();
          xhr.open('GET',userInfo.image.url, true);
          xhr.responseType = 'blob';
          xhr.onload = function(e) {
          userInfo.image.url=window.URL.createObjectURL(this.response);
          $("#imgProfile").attr("src", userInfo.image.url);
          };
          xhr.send();
          
          
          
        },
        error: function(error) {
          console.log("user exception");
        }
    });
  }
}
  
  //signup using parse.com api
  function Signup(userInfo){
      var user = new Parse.User();
      // set the properties of the user
      user.set("username", "jitendra.singh@magicsw.com");
      user.set("password", "singh");
      user.set("email", "jitendra.singh@magicsw.com");
      user.set("usertype", userType);
      // Create a custom field for the user (there is no limit to the number of custom records)
      user.set("score", 0);
      user.signUp(null, {
      success: function(user) {
             // return the success response
             console.log("Success!");
            $("#divLogin").hide();
            $("#divUserType").hide();
            $("#divHome").show();
            $("#divName").html(userInfo.displayName);
       },
       error: function(user, error) {
              // return the error response
              console.log("Error: " + error.code + " " + error.message);
        }
     });
    
  }
/* User End */
  
}]);

}());