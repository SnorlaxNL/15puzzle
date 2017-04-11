var hole;

$(document).ready(function(){
  //init
  var index = 0;
  var shuffled = shuffle();
  $("div.game img").each(function(){
    $(this).css({position: "absolute"});
    $(this).data("index", index);
    $(this).data("x", shuffled[index][0]);
    $(this).data("y", shuffled[index][1]);
    $(this).css({left: 106 * $(this).data("x"), top: 106 * $(this).data("y")});
    $(this).click(function(){ click($(this)); });
    index++;
  })
  hole = $("div.game img:last-child");
  $("div.game img:last-child").hide();
  makeSolvable();
  console.log(hole.data("x") + " - " + hole.data("y"));


function click(element){
  //determine direction
  var posHole = new Array(hole.data("x"), hole.data("y"));
  var posElement = new Array(element.data("x"), element.data("y"));
  var dxy = new Array(0,0);
  if(posHole[0] == posElement[0] - 1 && posHole[1] == posElement[1] ){
    hole.data("x", hole.data("x") + 1);
    dxy = [-1,0];
  }
  if(posHole[0] == posElement[0] + 1 && posHole[1] == posElement[1] ){
    hole.data("x", hole.data("x") - 1);
    dxy = [1,0];

  }
  if(posHole[0] == posElement[0] && posHole[1] == posElement[1] - 1 ){
    hole.data("y", hole.data("y") + 1);
    dxy = [0,-1];

  }
  if(posHole[0] == posElement[0] && posHole[1] == posElement[1] + 1){
    hole.data("y", hole.data("y") - 1);
    dxy = [0,1];
  }

  //shift
  element.data("x", element.data("x") + dxy[0] );
  element.data("y", element.data("y") + dxy[1] );
  element.animate({left: 106 * element.data("x"), top: 106 * element.data("y")}, 500);
  hole.animate({left: 106 * hole.data("x"), top: 106 * hole.data("y")}, 300);
  console.log(hole.data("x") + " - " + hole.data("y"));
}

function shuffle(){
  var result = new Array()
  var posible = [
    [true, true, true, true],
    [true, true, true, true],
    [true, true, true, true],
    [true, true, true, true]
  ];

  for(c = 0; c < 16; c++){
    do{
      x = Math.floor(Math.random()*4);
      y = Math.floor(Math.random()*4);
    }while(!posible[x][y])
    posible[x][y] = false;
    result.push(new Array(x,y));
  }
  return result;
}

function swapTiles(item1, item2){
  var x = item1.data("x");
  var y = item1.data("y");
  item1.data("x", item2.data("x"));
  item1.data("y", item2.data("y"));
  item2.data("x", x);
  item2.data("y", y);
  placeItem(item1);
  placeItem(item2);
}

function placeItem(item){
  item.css({left: 106 * item.data("x"), top: 106 * item.data("y")});
}

function makeSolvable(){
  var solvable = false;
  parityHole = (Math.abs(hole.data("x") - 3) + Math.abs(hole.data("y") - 3))%2;
  if (parityHole != parityPermutations()){
    console.log("repair");
    var index = 0
    while(!solvable){
      var to = $("div.game img").get(index).data("index");
      if($("div.game img").get(to) != hole){
        swapTiles($("div.game img").get(index), $("div.game img").get(to));
        solvable = true;
      }
      index++;
    }
  }
  else{
    console.log("no repair necesary")
    solvable = true;
  }
}

function parityPermutations(matrix){
  var grid = new Array();
  var swap = 0;
   $("div.game img").each(function(){
     grid.push($(this).data("index"));
   })

   for(var g = 0; g < 16; g++){
     if(grid[g] != g){
       var tmp = grid[g];
       grid[g] = grid[grid[g]];
       grid[grid[g]] =tmp;
       swap++;
     }
   }

   return swap%2;
}


});
