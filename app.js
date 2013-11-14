(function () {
  'use strict';
  var list = localStorage['list'] ? JSON.parse(localStorage['list']) : [];
  var app = angular.module('todo', []);
  app.controller('TodoCtrl', function ($scope) {
    $scope.list = list;
    $scope.addItem = function () {
      list.push({
        text: $scope.todoText,
        checked: false,
        color: ''
      });
      $scope.todoText = '';
    };
    $scope.inputKey = function ($event, id) {
      if ($event.keyCode !== 13) return;
      $scope.addItem(id);
    }
    $scope.removeItem = function (id) {
      list.splice(id, 1);
    };
    $scope.removeChecked = function () {
      $scope.list = list = list.filter(function (item) {
        return !item.checked;
      });
    };
    $scope.$watch(function () {
      return $scope.list;
    }, function () {
      localStorage['list'] = JSON.stringify(list.map(function (item) {
        return {
          text: item.text,
          checked: item.checked,
          color: item.color
        }
      }));
    }, true);
  });
})();
