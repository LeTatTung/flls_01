app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});
app
  .controller('NavbarController', function($scope, $rootScope, Auth, $state, Subjects){
    $scope.signedIn = Auth.isAuthenticated;
    $scope.logout = Auth.logout;

    Auth.currentUser().then(function (user){
      $rootScope.user = user;
      $scope.user = user;
    });

    $scope.getDataSearch = function () {
      Subjects.index($rootScope.user.id, $scope.search).then(function(data){
        $scope.data = data;
        $state.go('subjects.search', {search: $scope.search});
      });
    };

    $scope.show = function (subject) {
      $state.go('subjects.subject', {subject_id: subject.id})
    };

    $scope.$on('devise:new-registration', function (e, user){
      $rootScope.user = user;
    });

    $scope.$on('devise:login', function (e, user){
      $rootScope.user = user;
    });

    $scope.$on('devise:logout', function (e, user){
      $rootScope.user = undefined;
      $state.go('goodbye');
    });
  });
