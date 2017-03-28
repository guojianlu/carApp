angular.module('starter.controllers', [])

.controller('mapCtrl', function($scope,$rootScope) {
  var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom:16
  });
  map.plugin('AMap.Geolocation', function() {
    geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,//是否使用高精度定位，默认:true
      timeout: 10000,          //超过10秒后停止定位，默认：无穷大
      buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      buttonPosition:'RB'
    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition(function(status,result){
      $rootScope.nowCarLog = result.position.lng;
      $rootScope.nowCarLat = result.position.lat;
    });
    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
  });
  //解析定位结果
  function onComplete(data) {
  }
  //解析定位错误信息
  function onError(data) {
  }
})

.controller('carListCtrl',['$scope','$http',function($scope,$http){
  $scope.p = [$scope.nowCarLog,$scope.nowCarLat];
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(onS,onE);
    function onS(position){
      $scope.p = [position.coords.longitude,position.coords.latitude];
    }
    function onE(err){
      alert("定位失败");
    }
  }
  $scope.$watch('p',function(newValue,oldValue){
    $http.get('http://123.206.9.36/StopPark/index.php/admin/Park/api')
      .then(function(resp){
        var items1 = resp.data;
        //遍历数组，添加dis属性
        angular.forEach(items1,function(data){
          var lnglat = new AMap.LngLat(data.postion_X,data.postion_Y);
          var dis1 = lnglat.distance($scope.p);
          if(dis1){data.dis = dis1.toFixed(0);}
        });
        $scope.items = items1;
      });
  })
}])
  .controller('detailCtrl', function($scope,$stateParams,$state,$http,$rootScope) {
    $scope.detailInit = function(){
      //如果有缓存则显示进入停车场
      var storage = window.localStorage;
      if(storage.username){
        $scope.isLogin = true;
      }
    };
    //返回键
    $scope.barBack = function(){
      window.history.back();
    };
    $http.get('http://123.206.9.36/StopPark/index.php/admin/Park/api',{
      params:{
        id:$state.params.id
      }
    }).then(function(resp){
      //便利得到的数组，找到id与当前id相同的对象赋给detail
      angular.forEach(resp.data,function(data){
        if(data.id==$state.params.id){
          $scope.carDetail = data;
        }
      });
    });
    //登陆还是进入
    $scope.inOrLogin = function(){
      //如果已经登录
      if($scope.isLogin){
        //获取当前地理位置
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(onS,onE);
          function onS(position){
            //当前地理位置
            $scope.center = [position.coords.longitude,position.coords.latitude];
          }
          function onE(err){
            alert("定位失败");
          }
        }
        //carLat，carLog分别为当前进入的停车场的经纬度
        $rootScope.meCarLog = $scope.carDetail.position_X;
        $rootScope.meCarLat = $scope.carDetail.position_Y;
        //创建lnglat对象用来计算距离
        $scope.lnglat = new AMap.LngLat($scope.meCarLog,$scope.meCarLat);
        //dis1即为当前地点距停车场距离
        $scope.dis1 = $scope.lnglat.distance($scope.center);
        //如果算的距离$scope.dis1为undefined；
        if(!$scope.dis1){
          alert("未获取到你与停车场的距离，请检查是否开启GPS或是否已授予权限.然后重新点击进入停车场");
          return 0;
        }
        //如果距离大于500
        if($scope.dis1>500){alert("您当前位置与停车场超过500米，请在500内点击进入");}
        else {
          //在根作用域之添加一个进入停车场时间，在支付界面进行调用
          $rootScope.time = new Date().getTime();
          $rootScope.charge = $scope.carDetail.price;
          confirm("您已成功进入停车场");
          //禁用进入标签
          $rootScope.isIn = true;
          //可以点击支付了
          $rootScope.canPay = false;
        }
      }
      //如果未登陆则跳转到登陆界面
      else {
        $state.go('login');
      }
    }
  })
  .controller('meCtrl', function($scope,$stateParams) {

  })
  .controller('loginCtrl', function($scope,$stateParams,$http,$rootScope,$state) {
    $scope.staLogin = {
      tel:"",
      pwd:""
    };
    $scope.carLog = function(){
      $http.get('http://123.206.9.36/StopPark/index.php/Articale/login',{
        params:{
          username:$scope.staLogin.tel,
          password:$scope.staLogin.pwd
        }
      }).then(function(resp){
        if(resp.data.status==1){
          alert("用户名不存在");
          return 0;
        }
        else if(resp.data.status==2){
          alert("用户名或密码错误");
          return 0;
        }
        else if(resp.data.status==3){
          alert("登陆成功");
          if(!window.localStorage){
            alert("浏览器支持localstorage");
            return false;
          }else {
            var storage=window.localStorage;
            storage.username = $scope.staLogin.tel;
            $scope.staLogin.tel = "";
            $scope.staLogin.pwd = "";
            $rootScope.isLogin = true;
            $state.go('tab.carList');
          }
        }
      });
    }
  })
  .controller('registerCtrl', function($scope,$stateParams,$http,$state) {
    $scope.sta = {
      tel:"",
      pwd1:"",
      pwd2:""
    };
    $scope.carSub  = function(){
      //验证是否为数字
      $scope.canRegister = false;
      var re = /^[0-9]+.?[0-9]*$/;
      //如果输入的电话长度不为11或不是是数字
      if($scope.sta.tel.length!=11||!re.test($scope.sta.tel)){
        alert("请输入正确的号码格式");
        return 0 ;
      }
      else {
        //密码小于于六位
        if($scope.sta.pwd1.length<6&&$scope.sta.pwd2.length<6){
          alert("密码小于六位，请重新输入");
          return 0 ;
        }
        else {
          //密码不一致
          if($scope.pwd1!==$scope.pwd2){
            alert("两次密码不一致，请重新输入");
            return 0;
          }
          else {
            $http.get('http://123.206.9.36/StopPark/index.php/Articale/signUp',{
              params:{
                username:$scope.sta.tel,
                password:$scope.sta.pwd1
              }
            }).then(function(resp){
              if(resp.data.status==1){
                alert("用户名已存在");
                return 0;
              }
              else if(resp.data.status==2){
                alert("注册成功!");
                $state.go('login');
              }
            })
          }
        }
      }
    }
  })
  .controller('personalCtrl',function($scope,$rootScope){
    $scope.barBack = function(){
      window.history.back();
    };
  })
  .controller('carNumberBindCtrl',function($scope){
    $scope.barBack = function(){
      window.history.back();
    }
  })
  .controller('pwChangeCtrl',function($scope){
    $scope.barBack = function(){
      window.history.back();
    }
  })
  .controller('goPayCtrl',function($scope,$rootScope){
    //返回
    $scope.barBack = function(){
      window.history.back();
    };
    //time2是支付时间
    $rootScope.time2 = new Date().getTime();
    //监视time2对象，改变时执行以下函数
    $scope.$watch('time2',function(newValue,oldValue){
      //interval是间隔时间
      var interval = $scope.time2-$scope.time;
      var mon1 = $scope.charge*interval/3600000;
      //mon即为支付价格
      $scope.mon = mon1.toFixed(2);
    });
    $scope.confirmPayment = function(){
      confirm("支付成功！");
      $scope.mon = 0;
      //不能点击支付了
      $rootScope.canPay = true;
      //15分钟后执行goOut函数
      setTimeout("goOut()",900000);
      function goOut(){
        //获取当前地理位置
        navigator.geolocation.getCurrentPosition(onS,onE);
        function onS(position){
          $scope.center = [position.coords.longitude,position.coords.latitude];
        }
        function onE(err){
          alert("定位失败");
        }
        //创建lnglat对象用来计算距离
        $scope.lnglat = new AMap.LngLat($scope.nowCarLog,$scope.nowCarLat);
        //dis1即为当前地点距停车场距离
        $scope.dis1 = $scope.lnglat.distance($scope.center);
        //如果未获取当前定位，则重新获取
        if(!$scope.dis1){
          goOut();
        }
        //获取到定位后
        else {
          //判断距离，如果还未出停车场，则重新计算价钱
          if($scope.dis1<500){
            $rootScope.time3 = new Date().getTime();
            var interval2 = $scope.time3-$scope.time2;
            $scope.mon = interval2*$scope.charge/3600000;
            //可以点击支付了
            $rootScope.canPay = false;
          }
          //如果已经出了停车场
          else {
            //可以点击进入停车场
            $rootScope.isIn = false;
            //清空时间缓存
            $rootScope.time = 0;
            $rootScope.time2 = 0;
            $rootScope.time3 = 0;
            //不可以点击支付
            $rootScope.canPay = true;
          }
        }
      }
    }
  });



