(function () {
  'use strict';
  function append(item) {
    var li = document.createElement('li');
    li.innerHTML = itemTpl;
    li.querySelector('span').textContent = item.text;
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

  function saveList() {
    localStorage['list'] = JSON.stringify(list.map(function (item) {
      return {
        text: item.text,
        checked: item.checked,
        color: item.color
      }
    }));
  }

  var itemList = document.querySelector('#item-list');
  var label = document.querySelector('#label');
  var itemTpl = '<input type="checkbox"> <span></span>' +
    '<button class="remove">&times;</button><input type="color"/>';
  var list = localStorage['list'] ? JSON.parse(localStorage['list']) : [];

  list.forEach(function (item) {
    item.node = append(item);
  });

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
    var li = event.target.parentNode;
    if (event.target.type === 'checkbox') {
      var status = event.target.checked;
      list.some(function (item) {
        if (item.node !== li) return false;
        item.checked = status;
        return true;
      });
    } else if (event.target.type === 'color') {
      var color = event.target.value;
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
    if (event.target.classList.contains('remove')) {
      var li = event.target.parentNode;
      list.some(function (item, id) {
        if (item.node !== li) return false;
        list.splice(id, 1);
        itemList.removeChild(li);
        return true;
      });
      saveList();
    }
  });
})();
