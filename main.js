(function(){
  'use strict';
  function append(text) {
    var el = document.createElement('li');
    el.innerHTML = '<input type="checkbox"> <span></span>';
    el.querySelector('span').innerText = text;
    itemList.appendChild(el);
  }
  function addItem() {
    append(label.value);
    list.push(label.value);
    label.value = '';
    localStorage['list'] = JSON.stringify(list);
  }

  var itemList = document.querySelector('#item-list');
  var label = document.querySelector('#label');
  var list = localStorage['list'] ? JSON.parse(localStorage['list']) : [];

  list.forEach(function (el){
    append(el);
  });

  document.querySelector('#add-item').addEventListener('click', addItem);
  label.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) {
      addItem();
    }
  });
  document.querySelector('#remove-items').addEventListener('click', function() {
    [].forEach.call(document.querySelectorAll('li input:checked'), function(el) {
      var li = el.parentNode;
      list.splice(list.indexOf(li.querySelector('span').innerText), 1);
      itemList.removeChild(li);
      localStorage['list'] = JSON.stringify(list);
    });
  });
})();
