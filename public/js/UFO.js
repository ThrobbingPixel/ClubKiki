UFO = function( params ){
  
  this.scene = params.scene

  this.audioContext = params.audioContext

  this.texture = params.texture

  this.samples = params.samples

  this.segmentCount = 16

  this.curveX = 10
  this.curveY = 2
  this.curveZ = 8

  this.startPosition = params.startPosition

  this.segmentSpacing = 3

  this.segmentSize = 20

  this.segments = []

  this.segmentPositions = []

  this.segmentMagnitudes = []

  this.createBody()

  this.speed = 2 + ( Math.random() * 55 )

  this.color1 = new THREE.Vector3( Math.random(), Math.random(), Math.random() )
  this.color2 = new THREE.Vector3( Math.random(), Math.random(), Math.random() )

  this.segmentColors = []

  var i = 0
  while( i < this.segmentCount ){

    this.segmentColors.push( this[ 'color' + ( ( i % 2 ) + 1 ) ] )

    i++

  }

  console.log( this.colors )
}

UFO.prototype.remove = function(){

   this.scene.remove( this.body )

   this.scene.remove( this.marker )

   this.source.disconnect( 0 )
   this.source.disconnect( 0 )

   var _this = this
   setTimeout( function(){
    _this.source.stop( 0 )
   }, 1000)

}

UFO.prototype.createBody = function() {

  var geometry = new THREE.SphereGeometry( 30, this.segmentSize, this.segmentSize ),
  material = new THREE.MeshBasicMaterial( {color: 0xffff00} )

  this.marker = new THREE.Mesh( geometry, material )

  // this.scene.add( this.marker )
  
  this.body = new THREE.Object3D()
  this.body.position.set ( this.startPosition.x, this.startPosition.y, this.startPosition.z )

  var angle = Math.atan2( -1 * this.body.position.x, -1 * this.body.position.z )
  this.body.rotation.y = angle
  
  this.scene.add( this.body )

  var
  i = 0,
  geometry,
  material,
  now = this.audioContext.currentTime

  this.source = this.samples.play( Math.floor( Math.random() * 96 ), now, 0, .1, true, 0, 1, .5 )

  this.panner = this.audioContext.createPanner()
  this.panner.rolloffFactor = 0.2
  this.panner.refDistance = 10
  this.source.disconnect( 0 )
  this.source.connect( this.panner )
  this.panner.connect( this.samples.gain )

  this.analyser = this.audioContext.createAnalyser()
  this.analyser.fftSize = 32
  this.analyser.smoothingConstant = 0

  this.source.connect( this.analyser )

  while( i < this.segmentCount ){

    var 
    geometry = new THREE.BoxGeometry( this.segmentSize, this.segmentSize, this.segmentSize ),
    material = new THREE.MeshPhongMaterial({
      envMap: this.texture,
      reflectivity: 1,
      color: 0x000000,
      opacity: 0,
      transparent: true,
      combine: THREE.AddOperation
    }),
    cube = new THREE.Mesh( geometry, material )

    cube.position.z = ( this.segmentSize + this.segmentSpacing ) * i

    cube.rotation.z += .5 * i
    
    this.body.add( cube )

    this.segments.push( cube )

    this.segmentPositions.push( new THREE.Vector3() )
    
    i++

  }

  // console.log( this )

}

UFO.prototype.update = function( time ) {
  
  var
  i = 0,
  array = new Uint8Array( 16 ),
  s

  this.analyser.getByteFrequencyData( array )

  var
  z = Math.cos( Math.rad2deg( this.body.rotation.y ) * Math.PI / 180) * this.speed,
  x = Math.sin( Math.rad2deg( this.body.rotation.y ) * Math.PI / 180) * this.speed

  this.panner.setVelocity( (this.body.position.x - x) , 0, (this.body.position.z - z)  )

  this.body.position.z += z//time * 10 * ( ( this.body.rotation.y ) / ( 2 * Math.PI ) )
  this.body.position.x += x//time * 10 * ( ( ( 2 * Math.PI ) - this.body.rotation.y ) / ( 2 * Math.PI ) )
  
  this.scene.updateMatrixWorld()

  
  while( i < this.segmentCount ){

    this.segments[ i ].rotation.z += .1 * time
    s = Math.max( .01 *  array[ i ], .1 )
    this.segments[ i ].scale.set( s, s, 1)

    this.segmentPositions[ i ].setFromMatrixPosition( this.segments[ i ].matrixWorld )
    // this.segmentPositions[ i ].setFromMatrixPosition( this.body.matrixWorld )

    this.segmentMagnitudes[ i ] = s

    // this.segments[ i ].material.opacity = Math.abs( (( 600 - Math.distance( this.body.position.x, this.body.position.z, 0, 0  ) ) - 100 )/ 600 )
    // this.segments[ i ].rotation.y = Math.sin( i * time ) * Math.deg2rad( 45 )
    // this.segments[ i ].position.y = 10 * Math.cos(  ( 20 * time ) )
    
    i++

  }

  this.marker.position.set( this.segmentPositions[ 0 ].x, this.segmentPositions[ 0 ].y, this.segmentPositions[ 0 ].z  )


  this.panner.setPosition( this.body.position.x, this.body.position.y, this.body.position.z )

}