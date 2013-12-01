(function () {
  'use strict';
  function append(item) {
    var li = document.createElement('li');
    li.innerHTML = itemTpl;
    li.querySelector('input[type=text]').value = item.text;
    li.querySelector('input[type=checkbox]').checked = item.checked;
    li.querySelector('input[type=color]').value = item.color;
    li.style.backgroundColor = item.color;
    itemList.appendChild(li);
    return li;
  }

  function addItem() {
    var item = {
      text: label.value,
      checked: false,
      color: ''
    };
    item.node = append(item);
    list.push(item);
    label.value = '';
    saveList();
  }

  function newList(arr) {
    list = arr;
    list.forEach(function (item) {
      item.node = append(item);
    });
  }

  function loadList() {
    itemList.innerHTML = '';
    if (storage === 'local') {
      if (localStorage['todo-list']) {
        newList(JSON.parse(localStorage['todo-list']));
      }
    } else if (storage === 'server') {
      var data,
        request = new XMLHttpRequest();
      request.addEventListener('load', function () {
        try {
          data = JSON.parse(this.responseText);
        } catch (e) {
          data = [];
        }
        newList(data);
      });
      request.open('GET', 'http://localhost:1337/');
      request.send();
    }
  }

  function saveList() {
    var newList = list.map(function (item) {
      return {
        text: item.text,
        checked: item.checked,
        color: item.color
      }
    });
    if (storage === 'local') {
      localStorage['todo-list'] = JSON.stringify(newList);
    } else if (storage === 'server') {
      if (saveTimeoutID) {
        clearTimeout(saveTimeoutID);
      }
      saveTimeoutID = setTimeout(function () {
        var request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:1337/');
        request.send(JSON.stringify(newList));
      }, 500);
    }
  }

  var itemList = document.querySelector('#item-list');
  var label = document.querySelector('#label');
  var itemTpl = '<input type="checkbox"> <input type="text"/> ' +
    '<button class="remove">&times;</button> <input type="color"/>';
  var storage = 'local';
  var list = [];
  var saveTimeoutID;

  loadList();

  document.querySelector('#add-item').addEventListener('click', addItem);
  label.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) {
      addItem();
    }
  });
  document.querySelector('#remove-items').addEventListener('click', function () {
    var checkedElements = document.querySelectorAll('li input:checked');
    checkedElements = [].map.call(checkedElements, function (el) {
      return el.parentNode;
    });
    checkedElements.forEach(function (li) {
      list.some(function (item, id) {
        if (item.node !== li) return false;
        list.splice(id, 1);
        itemList.removeChild(li);
        return true;
      });
    });
    saveList();
  });
  itemList.addEventListener('change', function (event) {
    var color, status,
      li = event.target.parentNode;
    if (event.target.type === 'checkbox') {
      status = event.target.checked;
      list.some(function (item) {
        if (item.node !== li) return false;
        item.checked = status;
        return true;
      });
    } else if (event.target.type === 'color') {
      color = event.target.value;
      list.some(function (item) {
        if (item.node !== li) return false;
        item.color = color;
        li.style.backgroundColor = color;
        return true;
      });
    }
    saveList();
  });
  itemList.addEventListener('click', function (event) {
    var li;
    if (event.target.classList.contains('remove')) {
      li = event.target.parentNode;
      list.some(function (item, id) {
        if (item.node !== li) return false;
        list.splice(id, 1);
        itemList.removeChild(li);
        return true;
      });
      saveList();
    }
  });
  itemList.addEventListener('keyup', function (event) {
    var li;
    if (event.target.type === 'text') {
      li = event.target.parentNode;
      list.some(function (item, id) {
        if (item.node !== li) return false;
        item.text = event.target.value;
        return true;
      });
      saveList();
    }
  });
  document.querySelector('#storage').addEventListener('change', function (event) {
    storage = event.target.value;
    loadList();
  });
})();
