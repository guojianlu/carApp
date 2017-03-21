angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
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
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'carList': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('detail', {
    url: '/detail/{id}',
        templateUrl: 'templates/detail.html',
        controller: 'detailCtrl'
  })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerCtrl'
    });

  $urlRouterProvider.otherwise('/tab/map');

});
