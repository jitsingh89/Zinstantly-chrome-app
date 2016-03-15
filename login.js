(function(){

angular.module('zinstantlyApp', [])
.controller('zAuthCtrl', ['$scope', '$http', '$window', function ($scope,$http,$window) {
  $scope.userName = "";
  $scope.password = "";
  
  // Goolgle+ login
  $scope.Login = function () {
    console.log("login click");
    /*
    var ZinstantlyObject = Parse.Object.extend("Zinstantly");
    var zinstantlyObject = new ZinstantlyObject();
    zinstantlyObject.save({foo: "bar"}).then(function(object) {
      console.log("yay! it worked");
    });
      console.log(zinstantlyObject);
    */
    Parse.initialize("bTGQ7JecoARIo0Mw0wIV76HvJfTJ9RyDGtquT06Y", "P3YzXndJveNzk1XvlKrHS4XgP6cbtae9wWuugJDD");
    interactiveSignIn();
  };
  
  // Goolgle+  remove sesion event
  $scope.Logout = function () {
      console.log("Logout click");
     revokeToken();
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
  
  // Code updating the user interface, when the user information has been
  // fetched or displaying the error.
  function onUserInfoFetched(error, status, response) {
    if (!error && status == 200) {
      var user_info = JSON.parse(response);
      
      $("#divName").html(user_info.displayName);
      //$("#imgProfile").attr("src",user_info.image.url);
      $("#divLogin").hide();
      $("#divHome").show();
  
     /*     
    var user = new Parse.User();
    user.set("username", user_info.displayName);
    user.set("password", "singh");
    user.set("email", "jitendra.singh@magicsw.com");
    // other fields can be set just like with Parse.Object
    //user.set("phone", "415-392-0202");
    
    user.signUp(null, {
      success: function(user) {
        console.log("Save parse call");
        // Hooray! Let them use the app now.
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        console.log("Error: " + error.code + " " + error.message);
      }
    });
    */
    
    // Signup(user_info);
    //myFunction();
    
    
      Parse.initialize("Xuh7EnP1cjHyPhnyyLoSBvVNv8jiDrJmGTm1Q87l", "bTGQ7JecoARIo0Mw0wIV76HvJfTJ9RyDGtquT06Y");
      // create a new user object client side using the values retrieved from the form
      var user = new Parse.User();
       
      // set the properties of the user
      user.set("username", "jitsingh79");
      user.set("password", "singh");
      user.set("email", "jitendra.singh@magicsw.com");
      
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
      

     
    } else {
     // changeState(STATE_START);
    }
  }
  
  function myFunction() {
   
    var username= "jitendra.singh@magicsw.com";
    var password = "singh";

    Parse.User.signUp(username, password, {}, {
        success: function (user) {
            console.log("Yay!");
        },
        error: function (user, error) {
             console.log("Error: " + error.code + " " + error.message);
        }
    });
}



  function Signup(user_info){
      var userinfo= {username: 'jitendra.singh@gmail.com', password: 'singh'};
      Parse.User.signUp(userinfo, { ACL: new Parse.ACL() }, {
      success: function(user) {
        console.log(user);
      },
      error: function(user, error) {
        console.log("error " +error);
      }
    });
    
  }
  
  //google signin  
  function interactiveSignIn() {
  // @corecode_begin getAuthToken
  // @description This is the normal flow for authentication/authorization
  // on Google properties. You need to add the oauth2 client_id and scopes
  // to the app manifest. The interactive param indicates if a new window
  // will be opened when the user is not yet authenticated or not.
  // @see http://developer.chrome.com/apps/app_identity.html
  // @see http://developer.chrome.com/apps/identity.html#method-getAuthToken
  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
    } else {
      console.log('Token acquired:'+token+'.See chrome://identity-internals for details.');
       getUserInfo(true);
       // $window.location.href = "home/index.html";
    }
  });
  // @corecode_end getAuthToken
  }
  
  //google signout
  function revokeToken() {
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

}]);
}());