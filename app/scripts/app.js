angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .constant('app', {
        version: 'v1.0.0',
        corpid: 'wx44d125e53237e988',
        corpsecret: 'pobyKsmqh09nWh-EdhAEhwLhNki_Cy_oxdoJtKqHseK0sUGNiPR13K-8PJUbNsW-',
        'access_token': localStorage.getItem('X_TOKEN') || '',
        'wx_api': 'https://qyapi.weixin.qq.com/cgi-bin',
        'wx_api_map': {
            // 获得用户token
            '1': '/gettoken',
            // 获取成员信息
            '9': '/user/get',
            // 获得成员列表（简单信息））
            '10': '/user/simplelist',
            // 通过code 获得当前用户信息
            '38': '/user/getuserinfo',
            // 获得成员列表（详细信息））
            '59': '/user/list'
        }
    })

    .config(function ($provide) {
        $provide.decorator('$state', function ($delegate, $stateParams) {
            $delegate.forceReload = function () {
                return $delegate.go($delegate.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };
            return $delegate;
        });
    })

    .config(['$httpProvider', function ($httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // Enables Request.IsAjaxRequest() in ASP.NET MVC
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        // 针对IE，禁止缓存ajax 请求
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        $httpProvider.interceptors.push(['$q', 'app', function ($q, app) {

            return {
                request: function (config) {
                    var reg = /^\/wx$/;
                    var httpReg = /^https/;

                    config.params = config.params || {};

                    // 判断是否使用 wx debug 接口进行调试应用
                    if ('POST' === config.method && reg.test(config.url)) {
                        config.wxapi = true;
                        config.params.f = 'json';
                        config.params.access_token = app.access_token;

                        if (httpReg.test(location.href) && config.params.tid) {
                            config.url = config.wx_api + app['wx_api_map'][config.params.tid];
                            config.wxapi = false;
                        }
                    }

                    return config;
                },

                response: function (res) {
                    var rst = res.data, config = res.config, status = res.status;

                    if (200 === status || 204 === status) {

                        if (config.wxapi) {
                            res.data = JSON.parse(rst.content);
                            var errcode = res.data.errcode;

                            if (errcode > 0) {

                                if (42001 === errcode || 41001 === errcode) {
                                    app.$http({
                                        url: '/wx',
                                        method: 'POST',
                                        params: {
                                            'corpid': app.corpid,
                                            'corpsecret': app.corpsecret,
                                            'tid': 1
                                        }
                                    }).success(function (data) {
                                        localStorage.setItem('X_TOKEN', data.access_token);
                                        app.access_token = data.access_token;
                                        app.$state.reload();
                                    });
                                }

                                return $q.reject(res);
                            }

                            console.debug('wxapi:::ooOooo', res.data);
                        }

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
                abstract: true
            })

            .state('badge.my', {
                url: '^/badge/my',
                views: {
                    'main@': {
                        //templateUrl: 'views/badge-members.detail.html',
                        controller: "CurrentCtrl as CC"
                    }
                }
            })

            .state('badge.members', {
                url: '^/badge/members',
                views: {
                    'main@': {
                        templateUrl: 'views/badge-members.html',
                        controller: "MemberCtrl as MC"
                    }
                }
            })

            .state('badge.members.detail', {
                url: '^/badge/members/:id',
                views: {
                    'main@': {
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

    }]);

