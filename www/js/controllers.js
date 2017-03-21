angular.module('starter.controllers', [])

.controller('mapCtrl', function($scope) {
  //navigator.geolocation.getCurrentPosition(onSuccess,onError,{maximumAge:3000,timeout:6000,enableHighAccuracy:true});
  //function onSuccess(){
  //  console.log(1);
  //}
  //function onError(){
  //  console.log(2);
  //  var map = new AMap.Map('container',{
  //    resizeEnable: true,
  //    zoom: 15,
  //    center: [116.39,39.9]
  //  });
  //
  //}
  $scope.mapInit = function(){
    var map = new AMap.Map('container',{
      resizeEnable: true,
      zoom: 15,
      center: [116.39,39.9]
    });
  }
  $scope.mapInit();
})

.controller('carListCtrl',['$scope','$http','$state',function($scope,$http,$state){
  $scope.items=[
    {id:1,name:"奥体中心",distence:"2"},
    {id:2,name:"营盘街",distence:"1.5"}
  ];


}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
  .controller('detailCtrl', function($scope, $stateParams,$state) {
      $scope.id=$stateParams.id;

      $scope.go=function(){
        $state.go("login");
      }


  })
  .controller('loginCtrl', function($scope, $stateParams) {



  })
  .controller('registerCtrl', function($scope, $stateParams) {



  });



