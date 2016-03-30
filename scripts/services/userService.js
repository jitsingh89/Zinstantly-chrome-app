 
angular.module("zinstantlyApp.User",[])
.factory('userService', function () {
 
  var serviceObj = {};
  serviceObj.isLogin=false;
  serviceObj.SignUp = function () {
    //TO DO:
  };
 
  serviceObj.Login = function () {
  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
    } else {
      console.log('Token acquired:'+token+'.See chrome://identity-internals for details.');
       getUserInfo(true);
    }
  });
 };
 
  serviceObj.LogOut = function () {
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
 };

  // @corecode_begin getProtectedData
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
      var userInfo = JSON.parse(response);
      $("#divName").html(userInfo.displayName);
      //$("#imgProfile").attr("src",userInfo.image.url);
      $("#divLogin").hide();
      $("#divHome").show();
      
      isUserExist(userInfo);
      if(!serviceObj.isLogin)
         Signup(userInfo);
    } else {
     // changeState(STATE_START);
    }
  }
  
  //signup using parse.com api
  function Signup(userInfo){
      var user = new Parse.User();
      // set the properties of the user
      user.set("username", "jitendra.singh@magicsw.com");
      user.set("password", "singh");
      user.set("email", "jitendra.singh@magicsw.com");
      user.set("usertype", "student");
      // Create a custom field for the user (there is no limit to the number of custom records)
      user.set("score", 0);
      user.signUp(null, {
      success: function(user) {
             // return the success response
             console.log("Success!");
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
          },
          error: function(error) {}
      });
    
     
     
     Parse.User.logIn(username, password, {
      success: function(user) {
      console.log("user exit");
      serviceObj.isLogin=true;
      },
      error: function(user, error) {
        self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
        this.$(".login-form button").removeAttr("disabled");
      }
    });
}
  
 return serviceObj;
});