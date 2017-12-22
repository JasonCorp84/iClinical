app.controller("matchController", function ($scope, $state, $stateParams, matchService) {
  // this searches the open trial api by conditions passed in
  $scope.clinicalSearch = function(condition) {
    console.log(condition);
    matchService.getApi(condition)
      .then(function (response){
        console.log(response.data.items)
        $scope.apiResponse = response.data.items;
      })
      .catch(function (error){
        console.log(error)
      })
  }
 
  // matching function test
  $scope.matchingUserTest = function() {
    $scope.conditionMatch = "";
     // this is where the user is passed in
    matchService.getUsers()
      .then(function (response){
        var conds = [];
        var userId = userService.currentUser();
        $scope.currentUser = response.data[userId];
        console.log($scope.currentUser);
        // this is where the conditions check will to be added to the search
        if($scope.currentUser.cancer == true){
          conds.push("cancer");
        };
        if($scope.currentUser.cardiovascular == true){
          conds.push("cardiovascular");
        }
        if($scope.currentUser.congenital == true){
          conds.push("congenital");
        }
        if($scope.currentUser.ear == true){
          conds.push("ear%20hearing");
        }
        if($scope.currentUser.eye == true){
          conds.push("eye%20optical");
        }
        if($scope.currentUser.infection == true){
          conds.push("infection");
        }
        if($scope.currentUser.inflammatory == true){
          conds.push("inflammatory");
        }
        if($scope.currentUser.mentalHealth == true){
          conds.push("mental");
        }
        if($scope.currentUser.neurological == true){
          conds.push("neurological");
        }
        if($scope.currentUser.reproduction == true){
          conds.push("reproductive");
        }
        if($scope.currentUser.respiratory == true){
          conds.push("respiratory");
        }
        if($scope.currentUser.isObese == true){
          conds.push("obese");
        }
        if($scope.currentUser.isSmoker == true){
          conds.push("smoke");
        }
        console.log(conds)
        // this joins all the true conditions into a formatted search for the api
        $scope.conditionMatch = conds.join("%20");
        console.log($scope.conditionMatch);
      })
      .catch(function (error){
        console.log(error)
      })
      matchService.getApi($scope.conditionMatch)
      .then(function (response){
        console.log(response.data.items)
        $scope.apiResponse = response.data.items;
        // this calls the dope function to match 1-100 study results to the users profile
        $scope.matchTrimmer($scope.apiResponse)
      })
      .catch(function (error){
        console.log(error)
      })
      matchService.getApiTwo($scope.conditionMatch)
      .then(function (response){
        console.log(response.data.items)
        $scope.apiResponse.push(response.data.items);
        // this calls the dope function to match the 101 -200 study results to the users profile
        $scope.matchTrimmer($scope.apiResponse)
      })
      .catch(function (error){
        console.log(error)
      })
      matchService.getApiThree($scope.conditionMatch)
      .then(function (response){
        console.log(response.data.items)
        $scope.apiResponse.push(response.data.items);
        // this calls the dope function to match the 201-300 study results to the users profile
        $scope.matchTrimmer($scope.apiResponse)
      })
      .catch(function (error){
        console.log(error)
      })
  }

  // this trims the results to the users info
  $scope.matchTrimmer = function (theResults){
       // this will check if the study is still recruiting
    for (var i = theResults.length -1; i > 0; i--){
      if(theResults[i].recruitment_status !== "recruiting"){
        theResults.splice(i,1);
      }
    }
    console.log(theResults);
    // this checks if the study matches the users gender
    for (var i = theResults.length -1; i > 0; i--){
      if(theResults[i].gender != $scope.currentUser.gender.toLowerCase() && theResults[i].gender !== "both" ){
        theResults.splice(i,1);
      }
    }
    // this checks if the users' age matches the study
    console.log(theResults);
    for (var i = theResults.length -1; i > 0; i--){
      if(theResults[i].age_range != undefined){
        var max = theResults[i].age_range.max_age.slice(0, 2);
        var min = theResults[i].age_range.min_age.slice(0, 2);
        // console.log(min + " " + max);
        if($scope.currentUser.age > min){
          theResults.splice(i,1);
        }
        else if ($scope.currentUser.age < max){
          if(max != "N/"){
            theResults.splice(i,1);
          }
        }
      }
    }
    console.log(theResults);  
  }

    $scope.matchingUserTest();

})
  