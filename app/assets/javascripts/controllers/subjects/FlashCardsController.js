app
  .controller('FlashCardsController', function ($scope, $state, $stateParams, $timeout, Auth, Subjects,Words, subject_id) {
    $scope.canLoadMoreData = true;
    /**
     * Run controller
     */
    $scope.init = function () {
      $scope.cardIndex = 0;
      Subjects.show(subject_id).then(function(data){
        $scope.subject = data;
        $scope.record_id = data.words_limit.slice(-1).pop().id;
        $scope.changeDataCard($scope.cardIndex);
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

    $scope.flippe = function flipped () {
      $('.flashcard').toggleClass('flipped');
    };

    $(document).ready(function() {
      $(document).on('click', '.flashcard', function () {
        $('.flashcard').toggleClass('flipped');
      });
    });
    
    $scope.backPage = function () {
      $state.go('subjects.subject', {subject_id: subject_id})
    };

    $scope.plusDivs = function (n){
      if (n == 1){
        $scope.cardIndex += n;
        if ($scope.cardIndex == $scope.record_id -1){
          $scope.loadMore();
        }
        if ($scope.cardIndex >= $scope.subject.count_words -1){
          $scope.cardIndex = $scope.subject.count_words -1;
        }
      }else {
        if ($scope.cardIndex == 0){
          $scope.cardIndex = 0;
        }else{
         $scope.cardIndex += n;
        }
      }
      $scope.invert = ($scope.cardIndex + 1) / ($scope.subject.count_words) * 100;
      $scope.changeDataCard($scope.cardIndex);
    };
    $scope.autoPlay = function (n) {
      setInterval($scope.auto, 1500);
    };

    $scope.auto = function () {
      $scope.flippe;
      $timeout(function() {$scope.plusDivs(1)}, 1000);
    };

    $scope.shuffle = function () {
      var currentIndex = $scope.subject.words_limit.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = $scope.subject.words_limit[currentIndex];
        $scope.subject.words_limit[currentIndex] = $scope.subject.words_limit[randomIndex];
        $scope.subject.words_limit[randomIndex] = temporaryValue;
      }
      $scope.changeDataCard(0);
      return $scope.subject.words_limit;
    };

    $scope.changeDataCard = function (index) {
      $('.flashcard').removeClass('flipped');
      $scope.card_front = $scope.subject.words_limit[index].word_content;
      $scope.card_back = $scope.subject.words_limit[index ].definition_content;
    };

    $scope.handlerSlider = function () {
      var index = Math.ceil(($scope.invert) * ($scope.subject.count_words) / 100) -1;
      if (index == $scope.record_id -1)
        $scope.loadMore();
      $scope.changeDataCard(index);
    };
    $scope.init();
  });
