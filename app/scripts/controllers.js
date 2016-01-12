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

        vm.code = code;

        if (code) {
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
            }).error(function () {
                localStorage.removeItem('X_CODE');
            });
        } else {
            my(userId);
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
    }]);

    //.controller('BadgeMeCtrl', ['app', function (app) {
    //    var vm = this;
    //
    //    app.$http({
    //        url: '/api/badges'
    //    }).success(function (data) {
    //        vm.badgeList = data;
    //    });
    //
    //    vm.form = {
    //        toUser: parseInt(app.$stateParams.id),
    //        fromUser: 5,
    //        badge: 7
    //    };
    //
    //    vm.submit = function (form) {
    //        if (form.$valid) {
    //            app.$http({
    //                method: 'POST',
    //                url: '/api/record/add',
    //                data: vm.form
    //            }).success(function (data) {
    //                $state.go('badge.members.detail', {id: vm.toUser});
    //            });
    //        }
    //    };
    //
    //    return vm;
    //}]);

