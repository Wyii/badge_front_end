angular.module('starter.controllers', [])

    .controller('TabsCtrl', ['app', function (app) {
        var vm = this;
        var $ionicTabsDelegate = app.$injector.get('$ionicTabsDelegate');

        vm.select = function (index, state, params) {
            $ionicTabsDelegate.select(index);
            app.$state.go(state, params || {});
        };

        return this;

    }])

    // 获取当前用户信息
    .controller('CurrentCtrl', ['app', function (app) {
        var vm = this;

        var userid = localStorage.getItem('X_USER_ID');
        var code = localStorage.getItem('X_CODE');

        var my = function (userid) {
            if (userid) {
                app.$rootScope.current = userid;

                app.$state.transitionTo('badge.members.detail.records', {
                    id: userid
                }, {
                    location: 'replace'
                });

            } else {
                app.$state.transitionTo('badge.members', {}, {
                    location: 'replace'
                });
            }
        };

        if (userid) {
            my(userid);
        } else if (code) {
            app.$http({
                url: '/api/users/currentuser',
                params: {
                    code: code
                }
            }).success(function (data) {
                var userid = data.userid;
                localStorage.setItem('X_USER_ID', userid);
                localStorage.removeItem('X_CODE');
                my(userid);
            }).error(function () {
                localStorage.removeItem('X_CODE');
            });
        }

        return vm;
    }])

    // 用户列表
    .controller('MemberCtrl', ['app', '$scope', '$ionicScrollDelegate', function (app, $scope, $ionicScrollDelegate) {

        var vm = this;

        vm.memberList = [];

        vm.drag = function(){
            if(vm.limit < vm.memberList.length){
                vm.limit = (vm.limit || 0) + 20;
            }
        }

        app.$http({
            url: '/api/users'
        }).success(function (data) {

            vm.memberList = data;
            vm.limit = 20;


            // 这不是一个好的解决方案

            //vm.memberList = [];

            //angular.forEach(data, function (o) {
            //    vm.memberList.push(o);
            //})


            //var i = 0, interval = app.$injector.get('$interval');
            //var stop = interval(function(){
            //    vm.memberList[i] = data[i];
            //
            //    i ++;
            //    if(i == data.length){
            //        interval.cancel(stop);
            //    }
            //}, 20);
            //
            //vm.focusin = function(){
            //    console.debug(i, data.length);
            //    if(i < data.length){
            //        vm.memberList = data;
            //    }
            //};

            //app.storage('X_USERS', data);
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

        vm.toArray = function (length, max) {
            var rst = [], i = 1;
            while (i <= length) {
                if (i > max) {
                    rst.push(i % max || max);
                } else {
                    rst.push(i);
                }

                i++;
            }
            return rst;
        }

        return vm;
    }])

    // 用户信息 (关于用户的徽章信息列表)
    .controller('MemberDetailCtrl', ['app', function (app) {
        var vm = this;

        //vm.member = app.map(app.storage('X_USERS') || [], function(o, k){
        //    return {
        //        '__key__': o.userid,
        //        '__val__': o
        //    }
        //}, {})[app.$stateParams.id] || {};

        app.$http({
            url: '/api/users/' + app.$stateParams.id
        }).success(function (data) {
            if (!data) {
                return;
            }

            vm.member = data;
        });

        return vm;

    }])

    // 用户信息 (关于用户的徽章信息列表)
    .controller('MemberRecordsCtrl', ['app', function (app) {
        var vm = this;

        vm.userid = app.$stateParams.id;

        app.$http({
            url: '/api/users/' + vm.userid + '/badges'
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


