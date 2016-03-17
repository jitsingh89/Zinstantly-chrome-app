(function(){
Parse.initialize("Xuh7EnP1cjHyPhnyyLoSBvVNv8jiDrJmGTm1Q87l", "bTGQ7JecoARIo0Mw0wIV76HvJfTJ9RyDGtquT06Y");
angular.module('zinstantlyApp', ['zinstantlyApp.user'])
.controller('zAuthCtrl', ['$scope', '$http', '$window','userService', function ($scope,$http,$window,userService) {
  var userInfo = "";
  var userType="";
  
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
  
  //Click event of Create Question
  $scope.CreateQuestion=function(){
     $("#divCreateQuestion").show();
     $("#divQuestionDashboard").hide();
  };
  
 //Click event of Cancel Question 
  $scope.CancelQuestion=function(){
       $("#divQuestionDashboard").show();
       $("#divCreateQuestion").hide();
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
        // @corecode_begin removeAndRevokeAuthToken
        // @corecode_begin removeCachedAuthToken
        // Remove the local cached token
        chrome.identity.removeCachedAuthToken({ token: current_token },
          function() {});
        // @corecode_end removeCachedAuthToken
  
        // Make a request to revoke token in the server
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
                 current_token);
        xhr.send();
        // @corecode_end removeAndRevokeAuthToken
        
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
          //$("#imgProfile").attr("src",userInfo.image.url);
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
      user.set("username", "raju.singh@magicsw.com");
      user.set("password", "singh");
      user.set("email", "raju.singh@magicsw.com");
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
  
  //Check if user is exit or not
  function isUserExist(userInfo){
   var username= "jitendra.singh@magicsw.com";
   var password="singh";
   
   var userQuery = new Parse.Query(Parse.User);
   userQuery.equalTo('username', username);
   userQuery.find({
        success: function(userObject) {
            var user = Parse.User;
            user = userObject;
            console.log(user);
            return true;
        },
        error: function(error) {}
    });
}
  
}]);

}());