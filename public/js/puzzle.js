var puzzle = (function() {
  'use strict';
  var
    size = 5,
    initView = function() {
      createTable();
      randomizeTiles();

      // ViewModelを初期化し、プルダウンメニューとバインディングする。
      var setting = new Vue({
        el: '#setting',
        data: {
          size: size
      }});
      
      // ViewModelの値が更新されたらサイズを更新し、再描画する。
      setting.$watch('size', function(now, prev) {
        console.log('changed:', prev, '->', now);
        size = parseInt(now, 10);// サイズの更新
        createTable();
        randomizeTiles();
      });

      $('body').on('keyup', function (event) {
        for (var empty = 0; empty < size * size; empty++) {
          if ($('.tile').eq(empty).prop('value') == 0) {
            switch (event.key) {
              case "ArrowDown":
                if (empty - size >= 0) {
                  swap(empty - size);
                }
                break;
              case "ArrowUp":
                if (empty + size < size * size) {
                  swap(empty + size);
                }
                break;
              case "ArrowLeft":
                swap(empty + 1);
                break;
              case "ArrowRight":
                swap(empty - 1);
                break;
            }
            break;
          }
        }
      });
    };
  
  function createTable() {
    $('#container table').remove();
    var table = $('<table>').appendTo($('#container'));
    // size * size の分だけtd要素を作成する。
    _(size).times(function(i) {
      var tr = $('<tr>').appendTo(table);
      _(size).times(function(j) {
        var index = i * size + j;
        $('<td>').addClass('tile').appendTo(tr)
          .prop('index', index)
          .prop('value', index)
          .prop('textContent', index == 0 ? "" : index)
          .on("click", function() {
            swap(this.index);
          });
      });
    });
  }

  function randomizeTiles() {
    // 適当な回数だけユーザー操作をシュミレートすることで、ランダムな配置にする。
    _(5000).times(function() {
      swap(_.random(size * size - 1));
    });
  }

  function swap(i) {
    var swapBody = function(i, j) {
      // i番目とj番目のtd要素の表示内容を入れ替える。
      var 
        before = $('.tile').eq(i),
        after = $('.tile').eq(j),
        tmp_value = before.prop('value'); 
        
      before
        .prop('textContent', after.prop('textContent'))
        .prop('value', after.prop('value'));
      after
        .prop('textContent', tmp_value)
        .prop('value', tmp_value);
    }
    
    // 上下左右の順に空タイルが存在するかチェックし、
    // 存在していれば位置を入れ替える。
    if(i - size >= 0 && $('.tile').eq(i - size).prop('value') == 0) {
      swapBody(i, i - size);
    } else if(i + size < size * size && $('.tile').eq(i + size).prop('value') == 0) {
      swapBody(i, i + size);
    } else if(i % size != 0 && $('.tile').eq(i - 1).prop('value') == 0) {
      swapBody(i, i - 1);
    } else if(i % size != size - 1 && $('.tile').eq(i + 1).prop('value') == 0) {
      swapBody(i, i + 1);
    }
  }
    
  return { init: initView };
}());