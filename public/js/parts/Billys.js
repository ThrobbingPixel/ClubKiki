Billys = function( params ){

	this.scene = params.scene
	this.camera = params.camera

	this.onStopCallback = params.onStopCallback

	this.depth = params.depth || 5000

	this.path = 'media/video/billy/billy'
	this.extension = '.mp4'
	this.videoCount = 17

	this.videoURLs = []

	this.start()
}

Billys.prototype.addVideo = function ( id, url, loop, size ) {

	var video = document.createElement( 'video' )
	video.src = url
	video.loop = true
	video.load()
	video.play()

	// document.querySelector( '#main' ).appendChild( video )

	var canvas = document.createElement( 'canvas' )
	canvas.width = size
	canvas.height = size
	// document.querySelector( '#main' ).appendChild( canvas )

	var context = canvas.getContext( '2d' )
	context.fillStyle = '#' + Math.floor(Math.random() * 9) + '' + Math.floor(Math.random() * 9) + '' + Math.floor(Math.random() * 9) + ''
	context.fillRect( 0, 0, canvas.width, canvas.height )

	var texture = new THREE.Texture( canvas )
	texture.minFilter = THREE.LinearFilter
	texture.magFilter = THREE.LinearFilter


	var shader = ClubKikiShaders[ 'RoundFadeShader' ]

  var material =
  new THREE.ShaderMaterial({
    vertexShader:   shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    uniforms: shader.uniforms,
    side: THREE.DoubleSide,
    transparent: true
  }).clone()

  material.uniforms.uTex.value = texture


	// var material = new THREE.MeshBasicMaterial( { color: new THREE.Color( '#FFFFFF'), map: texture, overdraw: true } )
	// var material = new THREE.MeshBasicMaterial( { color: new THREE.Color( '#FFFFFF' ) } )

	this.activeVideos[ id ] = {
		'video': video,
		'canvas': canvas,
		'context': context,
		'texture': texture,
		'material': material
	}

}

Billys.prototype.add = function( id ) {

	var plane = new THREE.PlaneGeometry( 50, 50, 4, 4 )
	var movieScreen = new THREE.Mesh( plane, this.activeVideos[ Math.floor( Math.random() * (this.activeVideos.length ) ) ].material )

	movieScreen.position.set( ( Math.random() * 300 ) - 150,  (Math.random() * 10), Math.random() * this.depth )
	movieScreen.position.x += ( Math.sin( movieScreen.position.z /300 ) * Math.sin( movieScreen.position.z / 900 ) * 200 )
	this.billysObject.add( movieScreen )
	
	// this.camera.position.set(0,150,300)

}

Billys.prototype.createCross = function() {

}

Billys.prototype.update = function( delta ) {

	for ( var key in this.activeVideos ) {
		var obj = this.activeVideos[ key ]
		if ( obj.video.readyState === obj.video.HAVE_ENOUGH_DATA ) {
			obj.context.drawImage( obj.video, 0, 0 )
			obj.texture.needsUpdate = true
		}
	}

	TWEEN.update(  )

}

Billys.prototype.start = function() {

	for( var i = 0; i < this.videoCount; i++ ){
		this.videoURLs.push( this.path + ( i + 1 ) + this.extension )
	}

	this.billysObject = new THREE.Object3D()
	this.billysObject.position.z = -3 * this.depth
	this.billysObject.position.y = 20
	this.billysObject.rotation.x = .035

	this.scene.add( this.billysObject )

	this.activeVideos = []

	var i = 0
	while( i < this.videoCount ){

		this.addVideo( i, this.videoURLs[ i ], true, 512 )
		
		i++

	}

	i = 0
	while( i < this.depth / 5 ){
		this.add( i )
		i++
	}

	console.log( this.activeVideos )

	this.camera.lookAt( this.billysObject.position )

	this.tween = new TWEEN.Tween( this.billysObject.position )
	        .to( { z: 1000 }, 360000 )
	        .start()
	        .onComplete( _this.stop() )

}

Billys.prototype.stop = function() {

	if ( this.tween )
		TWEEN.remove( this.tween )

	this.scene.remove( billysObject )

	this.activeVideos = []

	this.onStopCallback( this )

}