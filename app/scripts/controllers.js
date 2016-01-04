angular.module('starter.controllers',[])

.controller('MemberCtrl',function($scope,$http){
    $http({
        url:"/api/"
    }).success(function(data){
        $scope.memberList = data;
    });
})

.controller('MemberDetailsCtrl',function($scope,$stateParams,$http){
    $http({
        url:"/api/user/" + $stateParams.id
    }).success(function(data){
        $scope.recordList = data.recordList;
        $scope.toUser = data.toUser
    });
})

.controller('BadgeCtrl',function($scope,$stateParams,$http){
    $http({
        url:"/api/badge/all"
    }).success(function(data){
        $scope.badgeList = data;
    });
    $scope.toUser = $stateParams.id;
    $scope.fromUser = 5
})

.controller('BadgeFormCtrl',function($scope,$http,$state){
    $scope.badge = {
        id:''
    };

    $scope.submit = function() {
        $http({
            method:"POST",
            url:"/api/record/add",
            params:{badge:$scope.badge.id,comment:$scope.comment,toUser:$scope.toUser,fromUser:$scope.fromUser}
        }).success(function(data){
           window.location.href = "/all/"+$scope.toUser;
            //$state.go('all',{id:$scope.toUser});
        });
    }
})

