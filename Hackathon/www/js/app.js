// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova', 'firebase', 'ngStorage', 'ui.bootstrap','ngAnimate'])

var fb = new Firebase("https://aselab9.firebaseio.com/"); //ur firebase url

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider){
    
    $stateProvider
     .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
      
  })
  
    .state('home',{
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
  })
 

  .state('Register',{
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerController'
  })
  
    .state('account',{
      url: '/account',
      templateUrl: 'templates/account.html',
      controller: 'AccountController'
  })
  
  .state('changePassword',{
      url: '/changePassword',
      templateUrl: 'templates/changePassword.html',
      controller: 'AccountController'
  })
  
    .state('changeEmail',{
      url: '/changeEmail',
      templateUrl: 'templates/changeEmail.html',
      controller: 'AccountController'
  })
  
  ;
 
  $urlRouterProvider.otherwise('/login');
})

app.controller('LoginController', function($scope, $state, $cordovaToast, $firebaseAuth, $localStorage){
    var fbAuth = $firebaseAuth(fb);
    var c = 0;
    $scope.login = function(email, password) {
        $localStorage.email = email;
        fbAuth.$authWithPassword({
            email: email,
            password: password
        }).then(function(authData) { 
            c = 0;
            //     $cordovaToast.show('Login Successful', 'short', 'bottom').then(function(success) {
            //     console.log("The toast was shown");
            // }, function (error) {
            //     console.log("The toast was not shown due to " + error);
            // });
                $state.go('home');
        }).catch(function(error) {
        //      $cordovaToast.show(error, 'long', 'bottom').then(function(success) {
        //     console.log("The toast was shown");
        // }, function (error) {
        //     console.log("The toast was not shown due to " + error);
        // });
            console.error("ERROR: " + error);
            c++;
            if(c==2){
                fb.removeUser({
                    email: "bobtony@firebase.com",
                    password: "correcthorsebatterystaple"
                    }, function(error) {
                    if (error) {
                        switch (error.code) {
                        case "INVALID_USER":
                            console.log("The specified user account does not exist.");
                            break;
                        case "INVALID_PASSWORD":
                            console.log("The specified user account password is incorrect.");
                            break;
                        default:
                            console.log("Error removing user:", error);
                        }
                    } else {
                        console.log("User account deleted successfully!");
                    }
                    });
            }
        });
    }
   
    $scope.register = function() {
        $state.go('Register')
        
    }
    
    
   $scope.resetPassword = function(email){
        // var fbAuth = $firebaseAuth(fb);
        fb.resetPassword({
            email: email
            }, function(error) {
                if (error) {
                switch (error.code) {
                 case "INVALID_USER":
                   console.log("The specified user account does not exist.");
                    // $cordovaToast.show('The specified user account does not exist.', 'short', 'bottom').then(function(success) {
                    //     console.log("The toast was shown");
                    // }, function (error) {
                    //  console.log("The toast was not shown due to " + error);
                    //  });
                    break;
                default:
             console.log("Error resetting password:", error);
                    // $cordovaToast.show('Error resetting password:' + error, 'short', 'bottom').then(function(success) {
                    //     console.log("The toast was shown");
                    // }, function (error) {
                    //  console.log("The toast was not shown due to " + error);
                    //  });
               }
             } else {
             console.log("Password reset email sent successfully!");
            //   $cordovaToast.show('Password reset email sent successfully!', 'short', 'bottom').then(function(success) {
            //             console.log("The toast was shown");
            //         }, function (error) {
            //          console.log("The toast was not shown due to " + error);
            //          });
            }
        });
   }
})

app.controller('registerController', function($scope, $state, $cordovaToast, $firebaseAuth){
   $scope.pageClass = 'register';
   var fbAuth = $firebaseAuth(fb);

$scope.register = function() {
        fbAuth.$createUser({email: $scope.email, password: $scope.password}).then(function(userData) {
            return fbAuth.$authWithPassword({
                email: $scope.email,
                password: $scope.password
            });
        }).then(function(authData) {
            console.log("Registration successfull!");
            //   $cordovaToast.show('Registration successfull!', 'short', 'bottom').then(function(success) {
            //             console.log("The toast was shown");
            //         }, function (error) {
            //          console.log("The toast was not shown due to " + error);
            //          });
            $state.go('login');
        }).catch(function(error) {
            console.error("ERROR: " + error);
            // $cordovaToast.show('Error' + error, 'short', 'bottom').then(function(success) {
            //             console.log("The toast was shown");
            //         }, function (error) {
            //          console.log("The toast was not shown due to " + error);
            //          });
        });
    }
 

});

app.controller('HomeController', function($scope, $state, $window, $filter,  $ionicPopover, $ionicPopup,$ionicLoading){
    $scope.account = function(){
        $state.go('account');
    }
    $scope.logoff = function(){
        $state.go('login');
    }
    

    
    var a=[];
    a[0] = 15;
    a[1] = 6
     $scope.changedate = function(date){
       
$scope.endDateMinDate = date;
$scope.$broadcast('refreshDatepickers');

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2016, 7, 1),
    minDate: new Date(),
    startingDay: 1
  };
  
   function disabled(data) {
    var date = data.date,
      mode = data.mode;  
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6 || date.getDate() === a[0] || date.getDate() === a[0] ||
    date.getDate === a[1]|| date.getDate() === a[2] || date.getDate() === a[3] || date.getDate() === a[5] || date.getDate() === a[6] ) ;
  }
        
         console.log(date.getDate() + 'getday' + date.getDay() + '/' + date) ;
        console.log('month ' + $filter('date')(date, 'MM') + ' day' + $filter('date')(date, 'dd') +
        ' year' +  $filter('date')(date,'yyyy'));
        };
        
    $scope.today = function() {
    $scope.dt = new Date();
    console.log("first " + $scope.dt);
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2016, 4, 10),
    min: new Date(2016, 3, 10),
    // minDate: new Date($filter('date')($scope.dt,'yyyy'),$filter('date')($scope.dt, 'MM'), $filter('date')($scope.dt, 'dd')),
    startingDay: 1
  };


  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;  
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6 || date.getDate() == 22) ;
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };
 
  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }
});

app.controller('AccountController', function($scope, $state, $cordovaToast, $localStorage){
    $scope.changePassword = function(){
        
        $state.go('changePassword');
    }
    
    $scope.changePasswordNew = function(oldPassword, newPassword){
        
        fb.changePassword({
            email: $localStorage.email,
            oldPassword: oldPassword,
            newPassword: newPassword
            }, function(error) {
            if (error) {
                switch (error.code) {
                case "INVALID_PASSWORD":
                    console.log("The specified user account password is incorrect.");
                    // $cordovaToast.show('The specified user account password is incorrect.', 'short', 'bottom').then(function(success) {
                    //     console.log("The toast was shown");
                    // }, function (error) {
                    //  console.log("The toast was not shown due to " + error);
                    //  });
                    break;
                case "INVALID_USER":
                    console.log("The specified user account does not exist.");
                    //  $cordovaToast.show('The specified user account does not exist.', 'short', 'bottom').then(function(success) {
                    //     console.log("The toast was shown");
                    // }, function (error) {
                    //  console.log("The toast was not shown due to " + error);
                    //  });
                    break;
                default:
                    console.log("Error changing password:", error);
                    //   $cordovaToast.show('Error changing password:' + error, 'short', 'bottom').then(function(success) {
                    //     console.log("The toast was shown");
                    // }, function (error) {
                    //  console.log("The toast was not shown due to " + error);
                    //  });
                }
            } else {
                console.log("User password changed successfully!");
                //  $cordovaToast.show('User password changed successfully!', 'short', 'bottom').then(function(success) {
                //         console.log("The toast was shown");
                //     }, function (error) {
                //      console.log("The toast was not shown due to " + error);
                //      });
                $state.go('account');
            }
            });
    }
    
    $scope.changeEmail = function(){
        $state.go('changeEmail');
    }
    $scope.changeEmailNew = function(newEmail, password){
            fb.changeEmail({
            oldEmail: $localStorage.email,
            newEmail: newEmail,
            password: password
            }, function(error) {
            if (error) {
                switch (error.code) {
                case "INVALID_PASSWORD":
                    console.log("The specified user account password is incorrect.");
                    //   $cordovaToast.show('The specified user account password is incorrect.', 'short', 'bottom').then(function(success) {
                    //     console.log("The toast was shown");
                    // }, function (error) {
                    //  console.log("The toast was not shown due to " + error);
                    //  });
                    break;
                case "INVALID_USER":
                    console.log("The specified user account does not exist.");
                    //  $cordovaToast.show('The specified user account does not exist.', 'short', 'bottom').then(function(success) {
                    //     console.log("The toast was shown");
                    // }, function (error) {
                    //  console.log("The toast was not shown due to " + error);
                    //  });
                    break;
                default:
                    console.log("Error creating user:", error);
                     $cordovaToast.show('Error creating user:' + error, 'short', 'bottom').then(function(success) {
                        console.log("The toast was shown");
                    }, function (error) {
                     console.log("The toast was not shown due to " + error);
                     });
                }
            } else {
                console.log("User email changed successfully!");
                //   $cordovaToast.show('User email changed successfully!', 'short', 'bottom').then(function(success) {
                //         console.log("The toast was shown");
                //     }, function (error) {
                //      console.log("The toast was not shown due to " + error);
                //      });
                $localStorage.email = newEmail;
                $state.go('account');
            }
            });
    }
})