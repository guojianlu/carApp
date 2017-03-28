angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(['$rootScope','$ionicPlatform',function($rootScope,$ionicPlatform) {
  $rootScope.isIn = false;
  //未进入停车场时不能点击支付
  $rootScope.canPay = true;
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}])

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');
  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })


  .state('tab.map', {
    url: '/map',
    views: {
      'map': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
      }
    }
  })

  .state('tab.carList', {
      url: '/carList',
      views: {
        'carList': {
          templateUrl: 'templates/carList.html',
          controller: 'carListCtrl'
        }
      }
    })

  .state('tab.me', {
    url: '/me',
    views: {
      'tab-account': {
        templateUrl: 'templates/me.html',
        controller: 'meCtrl'
      }
    }
  })

  .state('detail', {
    url: '/detail/{id}',
        templateUrl: 'templates/detail.html',
        controller: 'detailCtrl'
  })
    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
  .state('personal',{
    url:'/personal',
    templateUrl:'templates/personal.html',
    controller:'personalCtrl'
  })
  .state('carNumberBind',{
    url:'/carNumberBind',
    templateUrl:'templates/carNumberBind.html',
    controller:'carNumberBindCtrl'
  })
  .state('pwChange',{
    url:'/pwChange',
    templateUrl:'templates/pwChange.html',
    controller:'pwChangeCtrl'
  })
  .state('goPay',{
    url:'/goPay',
    templateUrl:'templates/goPay.html',
    controller:'goPayCtrl'
  });

  $urlRouterProvider.otherwise('/tab/map');

});
