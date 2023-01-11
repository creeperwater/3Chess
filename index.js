//判定数据
const checkData = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
//初始化矩阵
var matrix = [];
create(matrix, 0);
//绘制交互元素
var mainInner = '';
for (let i = 0; i < 9; i++) {
  mainInner += `<div id="num-${i}"></div>`;
}
$('main').innerHTML = mainInner;
//开启玩家交互权限
ban(false);
$('footer').onclick = ai;
$('footer').style.cursor = 'pointer';
//玩家落子事件
function human() {
  const choose = this.id.split('-')[1];
  if (!matrix[choose]) {
    down(choose, 1);
    if (check(1, matrix)) {
      $('header').innerText = '你赢了';
      over();
    } else if (!tie()) {
      main();
    }
  }
}
//AI先手事件
function ai() {
  main();
  setTimeout(() => { turns(1); }, 500);
}
//AI主程序
function main() {
  turns(2);
  ban();
  //创建权重阵列和选择队列
  var matrixPower = [], choiceList = [];
  create(matrixPower, -2);
  //拷贝矩阵副本用于AI模拟
  var copyMatrix = matrix.slice();
  //计算每个坐标权重
  for (let i = 0; i < 9; i++) {
    if (matrix[i] == 0) {
      copyMatrix[i] = 2;
      matrixPower[i] = judge(true);
      copyMatrix[i] = 0;
    }
  }
  for (let i = 0, max = Math.max(...matrixPower); i < 9; i++) {
    if (matrixPower[i] == max) {
      choiceList.push(i);
    }
  }
  down(choiceList[Math.floor(Math.random() * choiceList.length)], 2);
  if (check(2, matrix)) {
    $('header').innerText = '你输了';
    over();
  } else if (!tie()) {
    setTimeout(() => {
      turns(1);
      ban(false);
    }, 500);
  }
  //迭代器
  function judge(step) {
    var power = [], flag = true;
    if (step) {
      if (check(2, copyMatrix)) {
        return 1;
      } else {
        for (let i = 0; i < 9; i++) {
          if (copyMatrix[i] == 0) {
            copyMatrix[i] = 1;
            power.push(judge(!step));
            copyMatrix[i] = 0;
            flag = false;
          }
        }
      }
      return flag ? 0 : Math.min(...power);
    } else {
      if (check(1, copyMatrix)) {
        return -1;
      } else {
        for (let i = 0; i < 9; i++) {
          if (copyMatrix[i] == 0) {
            copyMatrix[i] = 2;
            power.push(judge(!step));
            copyMatrix[i] = 0;
            flag = false;
          }
        }
      }
      return flag ? 0 : Math.max(...power);
    }
  }

}
//获胜判定
function check(target, board) {
  for (let i = 0; i < 8; i++) {
    let flag = true;
    for (let j = 0; j < 3; j++) {
      if (board[checkData[i][j]] != target) {
        flag = false;
        break;
      }
    }
    if (flag) {
      return true;
    }
  }
  return false;
}
//平局判定
function tie() {
  for (let i = 0; i < 9; i++) {
    if (matrix[i] == 0) {
      return 0;
    }
  }
  $('header').innerText = '平局';
  over();
  return 1;
}
//禁用或接触禁用玩家操作
function ban(type = true) {
  if (type) {
    $('main>div').forEach(ele => {
      ele.onclick = null;
    });
    $('footer').onclick = null;
    $('footer').style.cursor = null;
  } else {
    $('main>div').forEach(ele => {
      ele.onclick = human;
    });
  }
}
//footer样式切换
function turns(value) {
  if (value == 1) {
    $('footer>p').innerText = '该你了';
    $('footer').style.left = '-20%';
  } else if (value == 2) {
    $('footer>p').innerText = 'AI计算中';
    $('footer').style.left = '-80%';
  } else {
    $('footer').style.left = null;
  }
}
//创建矩阵
function create(list, value) {
  for (let i = 0; i < 9; i++) {
    list[i] = value;
  }
}
//落子
function down(loc, val) {
  console.log(`${{ 1: '人类', 2: 'AI' }[val]}:${Math.floor(loc / 3 + 1)},${loc % 3 + 1}`);
  matrix[loc] = val;
  $(`#num-${loc}`).innerHTML = `<img src="${val}.svg">`;
}
//游戏结束
function over() {
  turns(0);
  ban();
  $('footer>p').innerText = '点击重置';
  $('footer').onclick = () => {
    location.reload();
  };
  $('footer').style.cursor = 'pointer';
}