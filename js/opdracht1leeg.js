$(document).ready(function(){
  //init
  var index = 0
  var hole;
  hole = $("img.gameCell:last-child");

  $("img.gameCell").each(function(){
    $(this).data("index", index);
    $(this).data("x", getXY(index).x);
    $(this).data("y", getXY(index).y);
    placeCell($(this));
    index++;
    $(this).click(function(){
      $(this).data("x", $(this).data("x") - 1);
      placeCell($(this));
      console.log($(this).data("index"));
      console.log($(this).data("x"));
      console.log($(this).data("y"));
    });
  })

  function placeCell(cell){
    cell.css({position: "absolute"});
    cell.animate({left: cell.data("x") * 106,top: cell.data("y")* 106}, 500)
  }

  function getXY(index){
    var x = index%4;
    var y = Math.floor(index/4);
    return {x: x, y: y};
  }


});
