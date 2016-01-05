// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
    //
    //.run(function($ionicPlatform) {
    //  $ionicPlatform.ready(function() {
    //    if(window.cordova && window.cordova.plugins.Keyboard) {
    //      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    //      // for form inputs)
    //      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //
    //      // Don't remove this line unless you know what you are doing. It stops the viewport
    //      // from snapping when text inputs are focused. Ionic handles this internally for
    //      // a much nicer keyboard experience.
    //      cordova.plugins.Keyboard.disableScroll(true);
    //    }
    //    if(window.StatusBar) {
    //      StatusBar.styleDefault();
    //    }
    //  });
    //})

    .constant('app', {
        version: 'v1.0.0'
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
    }])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('badge', {
                url: '^/badge',
                abstract: true
            })

            .state('badge.members', {
                url: '^/badge/members',
                views: {
                    'main@':{
                        templateUrl: 'views/badge-members.html',
                        controller: "MemberCtrl as MC"
                    }
                }
            })

            .state('badge.members.detail', {
                url: '^/badge/members/:id',
                views: {
                    'main@':{
                        templateUrl: 'views/badge-members.detail.html',
                        controller: "MemberDetailCtrl as MDC"
                    }
                }
            })


            .state('badge.me', {
                url: '^/badge/me/:id',
                views: {
                    'main@':{
                        templateUrl: 'views/badge-me.html',
                        controller: 'BadgeMeCtrl as BMC'
                    }
                }
            });

            $urlRouterProvider.otherwise('/badge/members');
    }])

    .run(['$injector', 'app', function($injector, app){
        app.$injector = $injector;
        app.$http = $injector.get('$http');
        app.$rootScope = $injector.get('$rootScope');
        app.$location = $injector.get('$location');
        app.$state = $injector.get('$state');
        app.$stateParams = $injector.get('$stateParams');

    }]);

