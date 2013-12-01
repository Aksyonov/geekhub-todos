(function () {
  'use strict';
  var app = angular.module('todo', []);
  app.service('Storage', function ($rootScope, $http, $timeout){
    var self = this;
    var saveTimeout;
    this.list = [];
    this.engine = 'local';
    this.load = function(){
      if (this.engine === 'local'){
        if (localStorage['todo-list']) {
          this.list = JSON.parse(localStorage['todo-list']);
        }
      } else if (this.engine === 'server'){
        $http.get('http://localhost:1337/').success(function(data) {
          self.list = data;
          if (!Array.isArray(self.list)) {
            self.list = [];
          }
        });
      }
    };
    $rootScope.$watch(function() {
      return self.list;
    }, function () {
      var newList = self.list.map(function (item) {
        return {
          text: item.text,
          checked: item.checked,
          color: item.color
        };
      });
      if (self.engine === 'local') {
        localStorage['todo-list'] = JSON.stringify(newList);
      } else if (self.engine === 'server'){
        if (saveTimeout) {
          $timeout.cancel(saveTimeout);
        }
        saveTimeout = $timeout(function () {
          $http.post('http://localhost:1337/', JSON.stringify(newList));
        }, 500, false);
      }
    }, true);
  });
  app.controller('TodoCtrl', function ($scope, Storage) {
    Storage.load();
    $scope.Storage = Storage;
    $scope.storages = {
      local: 'LocalStorage',
      server: 'Server'
    };
    $scope.addItem = function () {
      Storage.list.push({
        text: $scope.todoText,
        checked: false,
        color: ''
      });
      $scope.todoText = '';
    };
    $scope.inputKey = function ($event, id) {
      if ($event.keyCode !== 13) return;
      $scope.addItem(id);
    };
    $scope.removeItem = function (id) {
      Storage.list.splice(id, 1);
    };
    $scope.removeChecked = function () {
      Storage.list = Storage.list.filter(function (item) {
        return !item.checked;
      });
    };
    $scope.changeStorage = function (type) {
      Storage.engine = type;
      Storage.load();
    };
  });
})();
