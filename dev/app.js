/*
 * Module Init
 * */

var afSchema = angular.module('afSchema', ['ngAnimate', 'ngMaterial', 'ui.router']);

/*
 * Routes Config
 * */
afSchema.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/main");

        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'tests/tests.html',
                controller: ['$scope', '$rootScope', 'TestAF', function($scope, $rootScope, TestAF){
                    var testAf = new TestAF();
                    console.log(testAf);

                }]
            })
    }]);

/*
 * Run Config
 * */
afSchema.run(['$rootScope', '$timeout',
    function($rootScope, $timeout) {


    }]);



/*
 * Theme Config
 * */
afSchema.config(['$mdThemingProvider', function($mdThemingProvider){
    $mdThemingProvider.theme('default')
        .primaryPalette("deep-purple", {
            'default': '500',
            'hue-1': '600',
            'hue-2': '700',
            'hue-3': '800'
        })
        .accentPalette('purple', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        })
        .warnPalette('deep-orange', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });
    $mdThemingProvider.theme('purple')
        .primaryPalette("purple", {
            'default': '500',
            'hue-1': '600',
            'hue-2': '700',
            'hue-3': '800'
        })
        .accentPalette('purple', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        })
        .warnPalette('deep-orange', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });
    $mdThemingProvider.theme('deep-purple')
        .primaryPalette("deep-purple", {
            'default': '500',
            'hue-1': '600',
            'hue-2': '700',
            'hue-3': '800'
        })
        .accentPalette('deep-purple', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        })
        .warnPalette('deep-orange', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });
    $mdThemingProvider.theme('deep-orange')
        .primaryPalette("deep-orange", {
            'default': '500',
            'hue-1': '600',
            'hue-2': '700',
            'hue-3': '800'
        })
        .accentPalette('deep-orange', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        })
        .warnPalette('deep-orange', {
            'default': '400',
            'hue-1': '500',
            'hue-2': '600',
            'hue-3': '700'
        });
}]);