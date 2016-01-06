angular.module('starter.controllers', [])

    // 获取当前用户信息
    .controller('CurrentCtrl', ['app', function(app){
        var vm = this;

        var userId = localStorage.getItem('X_USER_ID');
        var code = localStorage.getItem('X_CODE');

        var my = function(userId){
            if(userId){
                app.$state.transitionTo('badge.members.detail.records', {
                    id: userId
                }, {
                    location: 'replace'
                });

            }else{
                app.$state.transitionTo('badge.members', {}, {
                    location: 'replace'
                });
            }
        };

        vm.code = code;

        if(code){
            app.$http({
                url: '/wx',
                method: 'POST',
                params: {
                    'code': code,
                    'agentid': app.corpid,
                    'tid': 38
                }
            }).success(function (data) {
                var userId = data.userId;
                localStorage.setItem('X_USER_ID', userId);
                my(userId);
            }).error(function(){
                localStorage.removeItem('X_CODE');
            });
        }else{
            my(userId);
        }

        return vm;
    }])

    // 首页
    // 用户列表（按徽章数倒序显示)
    .controller('MemberCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: '/wx',
            method: 'POST',
            params: {
                'department_id': 1,
                'fetch_child': 1,
                'status': 0,
                'tid': 59
            }
        }).success(function (data) {
            vm.memberList = data.userlist;
        });

        return vm;
    }])

    // 用户信息 (关于用户的徽章信息列表)
    .controller('MemberDetailCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: '/wx',
            method: 'POST',
            params: {
                'userid': app.$stateParams.id,
                'tid': 9
            }
        }).success(function (data) {
            vm.member = data;
        });

        return vm;

    }])

    // 用户信息 (关于用户的徽章信息列表)
    .controller('MemberRecordsCtrl', ['app', function (app) {
        var vm = this;

        vm.userId = app.$stateParams.id;

        app.$http({
            url: '/api/user/' + vm.userId
        }).success(function (data) {
            vm.recordList = data.recordList;
        });

        return vm;

    }])

    .controller('MemberBadgeMeCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: '/api/badge/all'
        }).success(function (data) {
            vm.badgeList = data;
        });

        vm.form = {
            toUser: app.$stateParams.id,
            fromUser: 5,
            badge: 7
        };

        vm.submit = function (form) {
            if (form.$valid) {
                app.$http({
                    method: 'POST',
                    url: '/api/record/add',
                    data: vm.form
                }).success(function (data) {
                    $state.transitionTo('badge.members.detail', {id: vm.toUser}, {location: 'replace'});
                });
            }
        };

        return vm;
    }])

    .controller('BadgeMeCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: '/api/badge/all'
        }).success(function (data) {
            vm.badgeList = data;
        });

        vm.form = {
            toUser: parseInt(app.$stateParams.id),
            fromUser: 5,
            badge: 7
        };

        vm.submit = function (form) {
            if (form.$valid) {
                app.$http({
                    method: 'POST',
                    url: '/api/record/add',
                    data: vm.form
                }).success(function (data) {
                    $state.go('badge.members.detail', {id: vm.toUser});
                });
            }
        };

        return vm;
    }]);

