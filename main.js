(function(){
  'use strict';
  function addItem() {
    var el = document.createElement('li');
    var text = label.value;
    el.innerHTML = '<input type="checkbox"> <span>' + text + '</span>';
    list.appendChild(el);
    label.value = '';
  }

  var list = document.querySelector('#item-list');
  var label = document.querySelector('#label');

  document.querySelector('#add-item').addEventListener('click', addItem);
  label.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) {
      addItem();
    }
  });
  document.querySelector('#remove-items').addEventListener('click', function() {
    [].forEach.call(document.querySelectorAll('li input:checked'), function(el) {
      var li = el.parentNode;
      list.removeChild(li);
    });
  });
})();
