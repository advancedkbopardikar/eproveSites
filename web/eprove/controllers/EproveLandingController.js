'use strict';

var EMAIL_API_URL = 'http://apps:8098/api/email/contactUs';

// create angular controller
app.controller('EproveLandingController', ['$scope', '$http', function($scope, $http, formData) {

    console.log('in controller');

    $http.defaults.useXDomain = true;

    $scope.formData = {};

    $scope.appName = "eProve";
    $scope.contactEmail = "kbopardikar@advanc-ed.org";

    $scope.submitForm = function(formData) {
        $http({
            url: EMAIL_API_URL,
            dataType: 'jsonp',
            method: 'POST',
            data: {appName:"eProve",
                name:"Kavita",
                contactEmail: "kbopardikar@advanc-ed.org",
                email: "kavbop@ad.com",
                institutionName: "Pizza Elementary School",
                about: "eProve",
                mediaSource:"AdvancED employee",
                additionalMessage:  "Message is here!"
            },
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Content-Type": "application/json"
            },
        }).success(function (response) {
            $scope.value = response.d;
        }).error(function (error) {
            //alert('Error! ' + error);
            console.log("ERROR!!! " + error);
        });
    }
}]);
