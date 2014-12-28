SampleMap = function ( params ) {

  this.url = params.url
  this.bpm = params.bpm || 120
  this.sampleCount = params.sampleCount || 1
  this.sampleBeatCount = params.sampleBeatCount || 1
  this.loadCompleteCallback = params.loadCompleteCallback
  this.errorCallback = params.errorCallback
  this.audioContext = params.audioContext
  this.gain = params.gain

  // this.gain = this.audioContext.createGain()
  this.beatDuration = ( 60 / this.bpm )
  this.buffer = null
  this.loaded = false
  this.loop = true
  this.bufferSourceMap = {}


  this._loadSample()

}

SampleMap.prototype.play = function ( index, startTime, beatOffset, durationInBeats, loop, loopStart, loopEnd, playbackRate, panObj, velocityObj ) {
  // 4 13 0 4 false 1 2 1 12 
  if( this.loaded ){

    var 
    _this = this,
    buffer = this.buffer,
    bufferSource = this.audioContext.createBufferSource(),

    offset = ( index * this.beatDuration ) + ( beatOffset * this.beatDuration ),

    // offset = ( ( ( index / this.sampleCount ) * ( this.sampleCount * this.beatDuration ) ) + ( beatOffset * this.beatDuration  ) ),
    duration = ( durationInBeats * this.beatDuration) || ( this.sampleBeatCount * this.beatDuration ),
    time = this.audioContext.currentTime,
    endTime = startTime + ( durationInBeats * ( this.beatDuration ) )

    bufferSource.playbackRate.value = playbackRate

    bufferSource.buffer = buffer

    if( panObj ){

      var panner = this.audioContext.createPanner()
      panner.setPosition( panObj.x, panObj.y, panObj.z )

      if( velocityObj )
        panner.setVelocity( velocityObj.x, velocityObj.y, velocityObj.z )

      bufferSource.connect( panner )
      panner.connect( this.gain )

    }
    else
      bufferSource.connect( this.gain )

    this.bufferSourceMap[ time ] = bufferSource

    bufferSource.addEventListener( 'onended', function (){

      console.log( 'end of sample' )
      delete _this.bufferSourceMap[ time ]

    })

    if ( loop ){
    
      bufferSource.loop = true
      bufferSource.loopStart = offset + ( loopStart * this.beatDuration )
      bufferSource.loopEnd = offset + ( loopEnd * this.beatDuration )

    }

    setTimeout( function(){
      bufferSource.start( startTime, offset, duration )
    },5)

    // bufferSource.stop( startTime + ( .75 * duration ) )

    return bufferSource

  }

}


SampleMap.prototype._loadSample = function (){

  if( this.url ){

    var
    _this = this,
    request = new XMLHttpRequest()
    request.open( 'GET', this.url, true )
    request.responseType = 'arraybuffer'

    request.onload = function() { 

      _this.audioContext.decodeAudioData( request.response, function( buffer ) {

        _this.buffer = buffer

        _this.loaded = true

        if( _this.loadCompleteCallback ) 
          _this.loadCompleteCallback()

      }, 

      function( error ){

        if( _this.errorCallback )
          _this.errorCallback( error )

        console.log( error )

      })
    }

    request.send()

  }
  
}