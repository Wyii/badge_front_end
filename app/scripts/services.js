angular.module('starter.services',[])

.factory('MemberList',function($http) {
    var memberList = [];
    $http({
        url:"http://localhost:8080/"
    }).success(function(data){
        memberList = data;
    });

    return {
        all: function () {
            return memberList;
        },
        get:function(id){
            for (var i = 0; i < memberList.length; i++) {
                if (memberList[i].id === parseInt(id)) {
                    return memberList[i];
                }
            }
            return null;
        }
    }
});