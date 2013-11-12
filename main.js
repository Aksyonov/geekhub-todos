(function(){
  'use strict';
  function append(text, status) {
    var el = document.createElement('li');
    el.innerHTML = '<input type="checkbox"> <span></span>';
    el.querySelector('span').innerText = text;
    if (status) {
      el.querySelector('input').checked = true;
    }
    itemList.appendChild(el);
  }
  function addItem() {
    if (label.value in list) return;
    append(label.value);
    list[label.value] = false;
    label.value = '';
    localStorage['list'] = JSON.stringify(list);
  }

  var itemList = document.querySelector('#item-list');
  var label = document.querySelector('#label');
  var list = localStorage['list'] ? JSON.parse(localStorage['list']) : {};

  for(var text in list) {
    if(list.hasOwnProperty(text)) {
      append(text, list[text]);
    }
  }

  document.querySelector('#add-item').addEventListener('click', addItem);
  label.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) {
      addItem();
    }
  });
  document.querySelector('#remove-items').addEventListener('click', function() {
    [].forEach.call(document.querySelectorAll('li input:checked'), function(el) {
      var li = el.parentNode;
      delete list[li.querySelector('span').innerText];
      itemList.removeChild(li);
      localStorage['list'] = JSON.stringify(list);
    });
  });
  itemList.addEventListener('change', function(event) {
    var li = event.target.parentNode;
    var status = event.target.checked;
    var text = li.querySelector('span').innerText;
    list[text] = status;
    localStorage['list'] = JSON.stringify(list);
  });
})();
