var hole;
var cells = [];
const MARGIN = 106;

$(document).ready(function(){
  init();
  shuffle2();
  makeSolvable();
  placeCells();
});

function init(){
  var i = 0;
  $("div.game img").each(function(){
      cells.push({
      index: i,
      position: i2position(i),
      item: $(this),
      hidden: false
    });
    i++;
  });

  cells.forEach(function(cell){
    cell.item.click(function(){ click(cell); });
    if(cell.item.is($("div.game img:last-child"))){
      hole = cell;
    }
  });
  hole.hidden = true;
}

function click(cell){
  //clicked cell and hole in same column
  if(hole.position.x == cell.position.x){
    var start = hole.position.y, end =  cell.position.y;
    if(start < end){
      cells.forEach(function(c){
        if(c.position.x == hole.position.x && start < c.position.y && c.position.y <= end)
          c.position.y--;
      });
    }
    if(end < start){
      cells.forEach(function(c){
        if(c.position.x == hole.position.x && end <= c.position.y && c.position.y < start)
          c.position.y++;
      });
    }
    hole.position.y = end;
  }
  //clicked cell and hole in same row
  if(hole.position.y == cell.position.y){
    var start = hole.position.x, end =  cell.position.x;
    if(start < end){
      cells.forEach(function(c){
        if(c.position.y == hole.position.y && start < c.position.x && c.position.x <= end)
          c.position.x--;
      });
    }
    if(end < start){
      cells.forEach(function(c){
        if(c.position.y == hole.position.y && end <= c.position.x && c.position.x < start)
          c.position.x++;
      });
    }
    hole.position.x = end;
  }
  if(solved()) { hole.hidden = false};
  placeCells(true);
}

function shuffle(){
  var taken = [false, false,false,false,false, false,false,false,false, false,false,false,false, false,false,false];
  var index;
  cells.forEach(function(cell){
    do{ index = Math.floor(Math.random()*16); } while(taken[index])
    taken[index] = true;
    cell.position = i2position(index);
    placeCell(cell);
  })
}

function shuffle2(){
  var places = new Array();
  //init array
  cells.forEach(function(cell){
    places.push(cell.index);
  });
  //shuffle array
  for(var p = 0; p < places.length ; p++){
    var r = Math.floor(Math.random() * places.length)
    var t = places[p];
    places[p] = places[r];
    places[r] = t;
  }
  //sort cells by array
  for(var c = 0; c < cells.length ; c++){
    cells[c].position.x = i2position(places[c]).x;
    cells[c].position.y = i2position(places[c]).y;
  }
}

function placeCell(cell, animate){
  var css = {left: MARGIN * cell.position.x, top: MARGIN * cell.position.y};
  if(cell.hidden){
    cell.item.hide();
  }
  else {
    cell.item.show();
  }
  cell.item.css({position: "absolute"});
  (animate?cell.item.animate(css):cell.item.css(css));
}

function placeCells(animate){
  cells.forEach(function(cell){
    placeCell(cell, animate);
  })
}

function makeSolvable(){
  var solvable = false;
  var md = manhantanDistance(hole.position, {x:3,y:3});
  var p = permutations();
  if (parity(md) != parity(p)){
    console.log("repair");
    for(var i = 0; !solvable && i < cells.size; i++){
      //current cell not in place AND position current cell not hole
      if(cells[i].position.is(i2position(i)) && hole.position.is(i2position(i))){
        //find cell on position current cell
        cells.forEach(function(cell){
          if(cell.position.is(i2position(i))){
            var tmpPos = cell.position;
            cell.position = cells[i].position;
            cells[i].position = tmpPos;
            placeCell(cell);
            placeCell(cells[i]);
          }
        })
        solvable = true;
      }
    }
  }
}

function solved(){
  var solved = true;
  cells.forEach(function(cell){
    solved &= (cell.position.x == i2position(cell.index).x && cell.position.y == i2position(cell.index).y);
  });
  return solved;
}

function i2position(index){
  return {
    x: index%4,
    y: Math.floor(index/4),
    is: function(position){
      return (this.x == position.x && this.y == position.y);
    }
  };
}

function position2i(position){ return position.y*4 + position.x;  }
function parity(number){ return number%2;}
function manhantanDistance(pos1, pos2){  return (Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)); }
function permutations(){
  var grid = new Array();
  var swap = 0;
  cells.forEach(function(cell){ grid.push(position2i(cell.position)); });
  for(var g1 = 0; g1 < 16; g1++){
    for(var g2 = g1 + 1; g2 < 16; g2++){
      if(grid[g2] == g1){
        grid[g2] = grid[g1];
        grid[g1] = g1;
        swap++;
      }
    }
  }
  return swap;
}
