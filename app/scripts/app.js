angular.module('starter', ['ionic', 'starter.controllers'])

    .constant('app', {
        'access_token': localStorage.getItem('X_TOKEN') || ''
    })

    .config(['$ionicConfigProvider', function ($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
    }])

    .config(['$httpProvider', function ($httpProvider) {

        $httpProvider.interceptors.push(['$q', 'app', function ($q, app) {

            return {
                request: function (config) {
                    //var reg = /^\/wx$/;
                    //var httpReg = /^https/;
                    //
                    //config.params = config.params || {};

                    //// 判断是否使用 wx debug 接口进行调试应用
                    //if ('POST' === config.method && reg.test(config.url)) {
                    //    config.wxapi = true;
                    //    config.params.f = 'json';
                    //    config.params.access_token = app.access_token;
                    //
                    //    if (httpReg.test(location.href) && config.params.tid) {
                    //        config.url = config.wx_api + app['wx_api_map'][config.params.tid];
                    //        config.wxapi = false;
                    //    }
                    //}

                    return config;
                },

                response: function (res) {
                    var rst = res.data, config = res.config, status = res.status;

                    if (200 === status || 204 === status) {

                        //if (config.wxapi) {
                        //    res.data = JSON.parse(rst.content);
                        //    var errcode = res.data.errcode;
                        //
                        //    if (errcode > 0) {
                        //
                        //        if (42001 === errcode || 41001 === errcode) {
                        //            app.$http({
                        //                url: '/wx',
                        //                method: 'POST',
                        //                params: {
                        //                    'corpid': app.corpid,
                        //                    'corpsecret': app.corpsecret,
                        //                    'tid': 1
                        //                }
                        //            }).success(function (data) {
                        //                localStorage.setItem('X_TOKEN', data.access_token);
                        //                app.access_token = data.access_token;
                        //                app.$state.reload();
                        //            });
                        //        }
                        //
                        //        return $q.reject(res);
                        //    }
                        //
                        //    console.debug('wxapi:::ooOooo', res.data);
                        //}

                        return res;
                    }

                    return $q.reject(res);
                },

                responseError: function (res) {
                    var status = res.status;
                    return $q.reject(res);
                }

            };
        }]);
    }])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('badge', {
                url: '^/badge',
                abstract: true,
                views: {
                    'main@': {
                        templateUrl: 'views/tabs.html',
                        controller: 'TabsCtrl as TC'
                    }
                }
            })

            // 我的徽章
            .state('badge.my', {
                url: '^/badge/my',
                views: {
                    'tabs': {
                        templateUrl: 'views/my-badge.html',
                        controller: "CurrentCtrl as CC"
                    }
                }
            })

            // 徽章榜
            .state('badge.roll', {
                url: '^/badge/roll',
                views: {
                    //'main@': {
                    'tabs': {
                        templateUrl: 'views/badge-roll.html',
                        controller: "BadgeRollCtrl as BRC"
                    }
                }
            })

            // 通讯录
            .state('badge.members', {
                url: '^/badge/members',
                views: {
                    //'main@': {
                    'tabs': {
                        templateUrl: 'views/badge-members.html',
                        controller: "MemberCtrl as MC"
                    }
                }
            })

            .state('badge.members.detail', {
                url: '^/badge/members/:id',
                views: {
                    'tabs@badge': {
                        templateUrl: 'views/badge-members.detail.html',
                        controller: "MemberDetailCtrl as MDC"
                    }
                }
            })

            .state('badge.members.detail.records', {
                url: '^/badge/members/:id/records',
                views: {
                    'action@badge.members.detail': {
                        templateUrl: 'views/member.records.html',
                        controller: "MemberRecordsCtrl as MRC"
                    }
                }
            })

            .state('badge.members.detail.badgeme', {
                url: '^/badge/members/:id/badgeme',
                views: {
                    'action@badge.members.detail': {
                        templateUrl: 'views/member.badgeme.html',
                        controller: 'MemberBadgeMeCtrl as MBMC'
                    }
                }
            });

        $urlRouterProvider.otherwise('/badge/my');
    }])

    .run(['$injector', 'app', function ($injector, app) {
        app.$injector = $injector;
        app.$http = $injector.get('$http');
        app.$rootScope = $injector.get('$rootScope');
        app.$location = $injector.get('$location');
        app.$state = $injector.get('$state');
        app.$stateParams = $injector.get('$stateParams');

        app.$rootScope.$state = app.$state;
        app.$rootScope.$stateParams = app.$stateParams;

        app.$rootScope.current = localStorage.getItem('X_USER_ID');

        app.storage = function(key, val){
            return val == null ? (function(){
                var _val = localStorage.getItem(key);
                if (typeof _val !== 'string') {
                    return undefined;
                }

                try {
                    return JSON.parse(_val);
                } catch (e) {
                    return _val || undefined;
                }
            })() : (function(){
                var str = JSON.stringify(val);
                str = str.replace(/^\"(.*)\"$/, '$1');
                localStorage.setItem(key, str);
            })();
        };

        app.map = function (obj, fn, oa) {
            var o = oa, rst;

            var isRstArray = angular.isArray(oa);

            angular.forEach(obj, function (val, key) {
                rst = fn.call(null, obj[key], key);
                if (isRstArray) {
                    o.push(rst);
                } else {
                    o[rst.__key__ || key] = rst.__val__ == null ? rst : rst.__val__;
                }
            })

            return o;
        };
    }]);



