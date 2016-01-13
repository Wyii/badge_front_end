angular.module('starter.controllers', [])

    .controller('TabsCtrl', ['app', function(app){
        var vm = this;
        var $ionicTabsDelegate = app.$injector.get('$ionicTabsDelegate');

        vm.select = function(index, state, params){
            app.$state.go(state, params || {});
            $ionicTabsDelegate.select(index);
        };

        return this;

    }])

    // 获取当前用户信息
    .controller('CurrentCtrl', ['app', function (app) {
        var vm = this;

        var userId = localStorage.getItem('X_USER_ID');
        var code = localStorage.getItem('X_CODE');

        var my = function (userId) {

            if (userId) {
                app.$rootScope.current = userId;

                app.$state.transitionTo('badge.members.detail.records', {
                    id: userId
                }, {
                    location: 'replace'
                });

            } else {
                app.$state.transitionTo('badge.members', {}, {
                    location: 'replace'
                });
            }
        };

        if(userId){
            my(userId);
        }else if(code){
            app.$http({
                url: 'api/users/current',
                params: {
                    code: code
                }
            }).success(function (data) {
                var userId = data.userId;
                localStorage.setItem('X_USER_ID', userId);
                localStorage.removeItem('X_CODE');
                my(userId);
            }).error(function () {
                localStorage.removeItem('X_CODE');
            });
        }

        return vm;
    }])

    // 用户列表
    .controller('MemberCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: '/api/users'
        }).success(function (data) {
            vm.memberList = data;
        });

        return vm;
    }])

    // 奖章排行榜（按徽章数倒序显示)
    .controller('BadgeRollCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: '/api/users/badged'
        }).success(function (data) {
            vm.memberList = data;
        });

        return vm;
    }])

    // 用户信息 (关于用户的徽章信息列表)
    .controller('MemberDetailCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: '/api/users/' + app.$stateParams.id
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
            url: '/api/users/' + vm.userId + '/badges'
        }).success(function (data) {
            vm.recordList = data;
        });

        return vm;

    }])

    .controller('MemberBadgeMeCtrl', ['app', function (app) {
        var vm = this;

        app.$http({
            url: '/api/badges'
        }).success(function (data) {
            vm.badgeList = data;
        });

        vm.form = {
            toUser: app.$stateParams.id,
            fromUser: app.$rootScope.current,
            badge: 7
        };



        vm.submit = function (form) {
            if (form.$valid) {
                vm.form.badge = vm.form.badge + '';
                app.$http({
                    method: 'POST',
                    url: '/api/records/add',
                    data: vm.form
                }).success(function (data) {
                    app.$state.transitionTo('badge.members.detail.records', {id: vm.form.toUser}, {
                        reload: true, inherit: false, notify: true
                    });
                });
            }
        };

        return vm;
    }]);


