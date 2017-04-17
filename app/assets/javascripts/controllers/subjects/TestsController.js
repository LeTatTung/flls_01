app
  .controller('TestsController', function ($rootScope, $scope, $state, $stateParams,
    Auth, Subjects,Words, subject_id) {

    $scope.canSubmit = true;

    $scope.init = function () {
      $scope.data = [];
      $scope.list_questions = [];
      $scope.selected_ids = [];
      $scope.correct_answers = [];
      $scope.answer_id = 1;
      $scope.selected = [];
      $scope.countCorrect = 0;
      $scope.arrIndex = [];
      $scope.record_id = Math.floor(Math.random() *
        ($rootScope.count_words - app.limit_word_record));
      Words.index(subject_id, $scope.record_id).then(function(data) {
        $scope.data = data;
        for (var i = 0; i < $scope.data.length; i++){
          $scope.arrIndex.push(i);
        }
        for (var i = 0; i < $scope.data.length; i++){
          $scope.createQuestion($scope.arrIndex, i);
        }
      });
    };

    $scope.arrRandom = function (arr, diff) {
      var arrCopy = arr.slice();
      var arrRandom = [];
      var count = 0;
      var i = 0;
      while (i < arrCopy.length){
        if (count == 3) break;
        i = Math.floor(Math.random() * arrCopy.length);
        if (arrCopy[i] != diff && arrCopy[i] >= 0){
          arrRandom.push(arrCopy[i]);
          delete arrCopy[i];
          count ++;
        }
      }
      return arrRandom;
    };

    $scope.createQuestion = function (arr, index_question) {
      var answer = {
        'id': null,
        'description': null
      };
      var question = {
        'id': null,
        'description': null,
        'answers': []
      };
      var arrRandom = $scope.arrRandom(arr,index_question);
      question.id = index_question;
      question.description = $scope.data[index_question].word_content;
      answer.id = $scope.answer_id;
      $scope.correct_answers.push(answer.id);
      answer.description = $scope.data[index_question].definition_content
      question.answers.push(answer);
      for (var i = 0; i < arrRandom.length; i++){
        $scope.answer_id ++;
        var answer = {
          'id': null,
          'description': null
        };
        answer.id = $scope.answer_id;
        answer.description = $scope.data[arrRandom[i]].definition_content;
        question.answers.push(answer);
      }
      $scope.answer_id ++;
      $scope.shuffleArray(question.answers);
      $scope.list_questions.push(question);
    };

    $scope.shuffleArray = function (array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    };

    $scope.backPage = function () {
      $state.go('subjects.subject', {subject_id: subject_id})
    };

    $scope.submit = function () {
      $scope.selected_ids = [];
      angular.forEach($scope.list_questions, function(question) {
        $scope.selected_ids.push(question.selected_id);
        if ($scope.checkInclude($scope.correct_answers, question.selected_id))
          $scope.countCorrect++;
      });
      $scope.canSubmit = false;
    };

    $scope.checkInclude = function (array, element) {
      for (var i = 0; i < array.length; i++){
        if (array[i] == element)
          return true;
      }
      return false;
    };

    $scope.changeColor = function (answer_id) {
      var color_red = 'color: red';
      var color_black = 'color: black';
      if ($scope.selected_ids.length == 0) {
        return color_black;
      } else {
        if ($scope.checkInclude($scope.correct_answers, answer_id)) {
          return color_red;
        }
        else
          return color_black;
      }
    };

    $scope.selectedQuestions = function (question_id) {
      if (!$scope.checkInclude($scope.selected, question_id)){
        $scope.selected.push(question_id);
        $scope.invert = $scope.selected.length / $scope.list_questions.length * 100;
      }
    };

    $scope.getResult = function () {
      return $scope.countCorrect / $scope.list_questions.length * 100;
    };

    $scope.print = function () {
      window.print();
    };
    $scope.init();
  });
