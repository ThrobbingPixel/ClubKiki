//credit: https://simpl.info/getusermedia/sources/

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

 WebcamSources = function ( params ){

 	this.sources = []

	if( params && params.gotSourcesCallback )
		this.gotSourcesCallback = params.gotSourcesCallback

	var _this = this

	if (typeof MediaStreamTrack === 'undefined'){
  	alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
	} else {
	  MediaStreamTrack.getSources( _this.gotSources.bind( _this ) )
	}

}

WebcamSources.prototype.gotSources = function( sourceInfos ) {

	for (var i = 0; i != sourceInfos.length; ++i) {

    var sourceInfo = sourceInfos[i]
    if (sourceInfo.kind === 'video') {
      this.sources.push( sourceInfo )
    } 
  }

  if( this.gotSourcesCallback )
  	this.gotSourcesCallback( this.sources )

}

WebcamSources.prototype.attachToElement = function( id, element  ) {
	
  var constraints = {
    video: {
      optional: [ { sourceId: id } ]
    }
  }

  navigator.getUserMedia(constraints, 
  	function (stream) {
  		var videoElement = document.createElement( 'video' )
		  // window.stream = stream // make stream available to console
		  videoElement.src = window.URL.createObjectURL(stream)
		  videoElement.play()
		  element.appendChild( videoElement )
		}, 
  	function (error){
  		console.log('navigator.getUserMedia error: ', error);
		}
	)

}