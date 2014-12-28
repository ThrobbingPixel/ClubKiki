window.addEventListener('load', function() {
  init()
})

function init(){

  var clubKiki = new ClubKiki({
    domElement: document.querySelector( '#main')
  })

}

window.requestAnimationFrame = (function(){
return window.requestAnimationFrame  ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function(callback){
  window.setTimeout(callback, 1000 / 60)
}
})()

Math.deg2rad = function( degrees ) {
  return degrees  * ( Math.PI/180)
}

Math.rad2deg = function(radians){
   degrees = 360 * radians/(2 * Math.PI);
   return degrees;
}

Math.distance = function(x, y, x0, y0){
  return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

