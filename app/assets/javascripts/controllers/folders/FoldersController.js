app
  .controller('FoldersController', function ($scope, $state, $stateParams, Auth, Folders, user_id) {
    /**
     * Init data
     */
    $scope.init = function () {
      Folders.index(user_id).then(function(data){
        $scope.data = data;
      });
    };

    /**
     * Show folder by folder id
     * @param folder: folder object
     */
    $scope.show = function (folder) {
      $state.go('users.user.folders.folder', {user_id: user_id, folder_id: folder.id})
    };

    /**
     * Run controller
     */
    $scope.init();
  });
