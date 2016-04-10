// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova', 'firebase', 'ngStorage', 'ui.bootstrap','ngAnimate', 'nsPopover'])

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
  
   .state('time',{
      url: '/time',
      templateUrl: 'templates/time.html',
      controller: 'Naga'
  })
  ;
 
  $urlRouterProvider.otherwise('/login');
});


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

app.controller('registerController', function($scope, $state, $cordovaToast, $firebaseAuth, $localStorage){
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

app.controller('HomeController', function($scope, $http, $state, $window, $filter, $stateParams, $localStorage){
    
var disabledDates = [];        
    $scope.account = function(){
        $state.go('account');
    }
    $scope.logoff = function(){
        $state.go('login');
    }
    
    $scope.time = function(){
        $localStorage.selectedRoom = 'room1';
        $state.go('time');
    }
    var a1 = [], a2=[],b1=[],b2=[];
    var url = "http://localhost:8075/MongoRestServiceExample/restService/user";
    var result = $http.get(url);
     result.success(function(result, status, headers, config) {
         console.log('Getting Data');
                if (result) {
                    userData = result;
                    for(i=0;i<userData.length;i++){
                        a1[i] = userData[i].date;
                        a2[i] = userData[i].time;
                    }
                    console.log(a1);
                    console.log(a2);
                    for(k=0;k<a1.length;k++){
                        for(j=k+1;j<a1.length;j++){
                            if(a1[k] == a1[j] && a1[j]!=null){
                                b1[k] = a1[j];
                                if(b2[k]!=null){
                                    b2[k] = b2[k] +',' + a2[j];
                                }
                                else{
                                    b2[k] = a2[k] + ',' + a2[j];
                                }
                                a1[j] = null;
                                a2[j] = null;
                                
                            }
                            else{
                                if(b2[k] == null){
                                    b1[k] = a1[k];
                                    b2[k] = a2[k];
                                }
                            }
                        }
                    }
                    console.log(b1);
                    console.log(b2);
                    //disable fillled dates
                  var i=0;
                    for(j=0;j<b2.length;j++){
                        if(b2[j]!=null){
                            var disabledDatesArrayTime = b2[j].split(',');
                        if(disabledDatesArrayTime.length>11){
                            var temp = b1[j].split('/')
                            disabledDates[i] = temp[1];
                            console.log("Disabled Dates" + temp[1]);
                            i++;
                        }      
                        }
                         
                    }  
                  
                    // $location.path('/home');
                } else {
                    alert('Sorry, check your credentials.')
                }
            });
            result.error(function(result, status, headers, config) {
                console.log(result);
            });
    var a=[];
    a[0] = 15;
    a[1] = 6
     $scope.changedate = function(date){
         
         
         $localStorage.dateSelected= $filter('date')(date, 'MM') + '/' + $filter('date')(date, 'dd') +
                '/' +  $filter('date')(date,'yyyy');
           for(i=0;i<b1.length;i++){
               if($localStorage.dateSelected == b1[i]){
                   var disabledTimeSlots = b2[i].split(',');
                   for(j=0;j<b2[i].length;j++){
                       console.log(disabledTimeSlots[j]);
                   }
               }
           }
           
           localStorage["timeSlots"] = JSON.stringify(disabledTimeSlots);
    //    $localStorage.dateSelected = date;
        $scope.endDateMinDate = date;
        $scope.$broadcast('refreshDatepickers');
        console.log(date)

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
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6 || date.getDate() === disabledDates[0] ) ;
        }
                
                // console.log(date.getDate() + 'getday' + date.getDay() + '/' + date) ;
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
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6 || date.getDate() === disabledDates[0] );
    // || date.getDate === disabledDates[1] || date.getDate === 25) ;
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

app.controller('Naga', function($scope, $state, $http, $localStorage){
    
    var b8am = false, b11am = false, b12pm = false, b1pm = false;
    var b9am = false, b2pm = false, b3pm = false, b4pm = false;
    var b10am = false, b5pm = false, b6pm = false, b7pm = false;
    

    if(JSON.parse(localStorage["timeSlots"])){
        
     var storedNames = JSON.parse(localStorage["timeSlots"]);
    console.log(storedNames);
    
    for(i=0;i<storedNames.length;i++){
        if(storedNames[i] == '8am'){
            document.getElementById('a8am').disabled = true;
            document.getElementById('a8am').style.backgroundColor = 'red';
            // b8am = true;
        }
        else if(storedNames[i] == '9am'){
            document.getElementById('a9am').disabled = true;
            document.getElementById('a9am').style.backgroundColor = 'red';
            // b9am = true;
        }
        else if(storedNames[i] == '10am'){
            document.getElementById('a10am').disabled = true;
            document.getElementById('a10am').style.backgroundColor = 'red';
            // b10am = true;
        }
        else if(storedNames[i] == '11am'){
            document.getElementById('a11am').disabled = true;
            document.getElementById('a11am').style.backgroundColor = 'red';
            // b11am = true;
        }
        else if(storedNames[i] == '12pm'){
            document.getElementById('a12pm').disabled = true;
            document.getElementById('a12pm').style.backgroundColor = 'red';
            // b12pm = true;
        }
        else if(storedNames[i] == '1pm'){
            document.getElementById('a1pm').disabled = true;
            document.getElementById('a1pm').style.backgroundColor = 'red';
            // b1pm = true;
        }
        else if(storedNames[i] == '2pm'){
            document.getElementById('a2pm').disabled = true;
            document.getElementById('a2pm').style.backgroundColor = 'red';
            // b2pm = true;
        }
         else if(storedNames[i] == '3pm'){
            document.getElementById('a3pm').disabled = true;
            document.getElementById('a3pm').style.backgroundColor = 'red';
            // b3pm = true;
        }
         else if(storedNames[i] == '4pm'){
            document.getElementById('a4pm').disabled = true;
            document.getElementById('a4pm').style.backgroundColor = 'red';
            // b4pm = true;
        }
        else if(storedNames[i] == '5pm'){
            document.getElementById('a5pm').disabled = true;
            document.getElementById('a5pm').style.backgroundColor = 'red';
            // b5pm = true;
        }
         else if(storedNames[i] == '6pm'){
            document.getElementById('a6pm').disabled = true;
            document.getElementById('a6pm').style.backgroundColor = 'red';
            // b6pm = true;
        }
         else if(storedNames[i] == '7pm'){
            document.getElementById('a7pm').disabled = true;
            document.getElementById('a7pm').style.backgroundColor = 'red';
            // b7pm = true;
        }
    }
        
    }
    
    
    
     $scope.a8am = function(){
        if(b8am){
            document.getElementById('a8am').style.backgroundColor = 'green';
            b8am = false;
        }else{
            document.getElementById('a8am').style.backgroundColor = 'orange';
            b8am = true;
        }
        
    }
     $scope.a9am = function(){
        if(b9am){
            document.getElementById('a9am').style.backgroundColor = 'green';
            b9am = false;
        }else{
            document.getElementById('a9am').style.backgroundColor = 'orange';
            b9am = true;
        }
        
    }
     $scope.a10am = function(){
        if(b10am){
            document.getElementById('a10am').style.backgroundColor = 'green';
            b10am = false;
        }else{
            document.getElementById('a10am').style.backgroundColor = 'orange';
            b10am = true;
        }
        
    }
     $scope.a11am = function(){
        if(b11am){
            document.getElementById('a11am').style.backgroundColor = 'green';
            b11am = false;
        }else{
            document.getElementById('a11am').style.backgroundColor = 'orange';
            b11am = true;
        }
        
    }
     $scope.a12pm = function(){
        if(b12pm){
            document.getElementById('a12pm').style.backgroundColor = 'green';
            b12pm = false;
        }else{
            document.getElementById('a12pm').style.backgroundColor = 'orange';
            b12pm = true;
        }
        
    }
     $scope.a1pm = function(){
        if(b1pm){
            document.getElementById('a1pm').style.backgroundColor = 'green';
            b1pm = false;
        }else{
            document.getElementById('a1pm').style.backgroundColor = 'orange';
            b1pm = true;
        }
        
    }
     $scope.a2pm = function(){
        if(b2pm){
            document.getElementById('a2pm').style.backgroundColor = 'green';
            b2pm = false;
        }else{
            document.getElementById('a2pm').style.backgroundColor = 'orange';
            b2pm = true;
        }
        
    }
     $scope.a3pm = function(){
        if(b3pm){
            document.getElementById('a3pm').style.backgroundColor = 'green';
            b3pm = false;
        }else{
            document.getElementById('a3pm').style.backgroundColor = 'orange';
            b3pm = true;
        }
        
    }
     $scope.a4pm = function(){
        if(b4pm){
            document.getElementById('a4pm').style.backgroundColor = 'green';
            b4pm = false;
        }else{
            document.getElementById('a4pm').style.backgroundColor = 'orange';
            b4pm = true;
        }
        
    }
    $scope.a5pm = function(){
        if(b5pm){
            document.getElementById('a5pm').style.backgroundColor = 'green';
            b5pm = false;
        }else{
            document.getElementById('a5pm').style.backgroundColor = 'orange';
            b5pm = true;
        }
        
    }
      $scope.a6pm = function(){
        if(b6pm){
            document.getElementById('a6pm').style.backgroundColor = 'green';
            b6pm = false;
        }else{
            document.getElementById('a6pm').style.backgroundColor = 'orange';
            b6pm = true;
        }
        
    }
      $scope.a7pm = function(){
        if(b7pm){
            document.getElementById('a7pm').style.backgroundColor = 'green';
            b7pm = false;
        }else{
            document.getElementById('a7pm').style.backgroundColor = 'orange';
            b7pm = true;
        }
        
    }
    
    
    
    $scope.done = function(){     
      
      var str =[];
      
        
        if(b8am){
            console.log("Pushing 8am");
            str.push('8am'); 
        }
        if(b9am){
            console.log("Pushing 9am");
            str.push('9am');
        }
        if(b10am){
            console.log("Pushing 10am");
            str.push('10am');
        }
        if(b11am){
            console.log("Pushing 11am");
            str.push('11am');
        }
        if(b12pm){
            console.log("Pushing 12pm");
            str.push('12pm');
        }
        if(b1pm){
            console.log("Pushing 1pm");
            str.push('1pm');
        }
        if(b2pm){
            console.log("Pushing 2pm");
            str.push('2pm');
        }
        if(b3pm){
            console.log("Pushing 3pm");
            str.push('3pm');
        }
         if(b4pm){
            console.log("Pushing 4pm");
            str.push('4pm');
        }
         if(b5pm){
            console.log("Pushing 5pm");
            str.push('5pm');
        }
         if(b6pm){
            console.log("Pushing 6pm");
            str.push('6pm');
        }
         if(b7pm){
            console.log("Pushing 7pm");
            str.push('7pm');
        }
        
        var k = str.toLocaleString();
        
        var data = {
          email: $localStorage.email,
          date: $localStorage.dateSelected,
          room: $localStorage.selectedRoom,
          time: str.toString()
      }
        var url = "http://localhost:8075/MongoRestServiceExample/restService/user";
        var res = $http.post(url, data);
        res.success(function(result, status, headers, config){
            console.log(result)
        });
         res.error(function(data, status, headers, config) {
                console.log(data);
                alert("There was some issue while registering. Please try again.")
            });
            $state.transitionTo('home', null, {'reload':true});
            // $state.go('home', {}, { reload: true });
            // $state.go('home');
    }
    
      
   
})