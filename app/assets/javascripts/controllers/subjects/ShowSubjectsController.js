app
  .controller('ShowSubjectsController', function ($rootScope, $scope,
    $state, $stateParams, Auth, Subjects, Words, subject_id) {
    $scope.canLoadMoreData = true;
    /**
     * Init data
     */
    $scope.init = function () {
      Subjects.show(subject_id).then(function(data){
        $rootScope.subject = data;
        $scope.record_id = data.words_limit.slice(-1).pop().id;
        $rootScope.count_words = $scope.subject.count_words;
      });
    };
    $scope.loadMore = function () {
      Words.index(subject_id, $scope.record_id).then(function(data) {
        $scope.subject.words_limit.push.apply($scope.subject.words_limit, data);
        $scope.record_id = data.slice(-1).pop().id;
        if (data.length < app.limit_word_record)
          $scope.canLoadMoreData = false;
      });
    };
    /**
     * Show subject by subject id
     * @param subject: subject object
     */
    $scope.show = function (subject) {
      $state.go('')
    };
    $scope.flashCard = function () {
      $state.go('subjects.subject.flash_card',
        {subject_id: subject_id})
    };
    $scope.test = function () {
      $state.go('subjects.subject.test',
        {subject_id: subject_id})
    };
    /**
     * Run controller
     */
    $scope.init();
  });
