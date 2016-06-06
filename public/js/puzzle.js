var puzzle = (function() {
  'use strict';
  var
    size = 5,
    tiles = [],
    createTable = function($container) {
      var table = $('<table>').appendTo($container);
      // size * size の分だけtd要素を作成する。
      _(size).times(function(i) {
        var tr = $('<tr>').appendTo(table);
        _(size).times(function(j) {
          var 
            index = i * size + j,
            td = $('<td>').addClass('tile').appendTo(tr),
            dom_td = td[0];
          
          dom_td.index = index;
          dom_td.value = index;
          dom_td.textContent = index == 0 ? "" : index;
          dom_td.onclick = function(e) {
            swap(e.srcElement.index);
          };
          
          tiles.push(dom_td);
        });
      });
      
      // 適当な回数だけ入れ替えを行い、ランダムな配置にする。
      _(5000).times(function() {
        swap(_.random(size * size - 1));
      });
    };
  
  function swap(i) {
    var swapBody = function(i, j) {
      var tmp = tiles[i].value;
      tiles[i].textContent = tiles[j].textContent;
      tiles[i].value = tiles[j].value;
      tiles[j].textContent = tmp;
      tiles[j].value = tmp;
    }
    
    // 上下左右の順に空タイルが存在するかチェックし、
    // 存在していれば位置を入れ替える。
    if(i - size >= 0 && tiles[i - size].value == 0) {
      swapBody(i, i - size);
    } else if(i + size < size * size && tiles[i + size].value == 0) {
      swapBody(i, i + size);
    } else if(i % size != 0 && tiles[i - 1].value == 0) {
      swapBody(i, i - 1);
    } else if(i % size != size - 1 && tiles[i + 1].value == 0) {
      swapBody(i, i + 1);
    }
  }
    
  return { init: createTable };
}());