angular.module('starter.controllers', [])

    // 首页
    // 用户列表（按徽章数倒序显示)
    .controller('MemberCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: "/api/"
        }).success(function (data) {
            vm.memberList = data;
        });

        return vm;
    }])

    // 用户信息 (关于用户的徽章信息列表)
    .controller('MemberDetailCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: "/api/user/" + app.$stateParams.id
        }).success(function (data) {
            vm.recordList = data.recordList;
            vm.toUser = data.toUser
        });

        return vm;

    }])

    .controller('BadgeMeCtrl', ['app', function (app) {
        var vm = this;
        
        app.$http({
            url: "/api/badge/all"
        }).success(function (data) {
            vm.badgeList = data;
        });

        vm.form = {
            toUser: parseInt(app.$stateParams.id),
            fromUser: 5,
            badge: 7
        };

        vm.submit = function(form){
            if(form.$valid){
                app.$http({
                    method: "POST",
                    url: "/api/record/add",
                    data: vm.form
                }).success(function (data) {
                    $state.go('badge.members.detail',{id:vm.toUser});
                });
            }
        };

        return vm;
    }]);

