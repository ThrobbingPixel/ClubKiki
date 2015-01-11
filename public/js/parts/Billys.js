Billys = function( params ){

	this.scene = params.scene
	this.camera = params.camera

	this.depth = params.depth || 5000

	this.backgroundMesh = params.backgroundMesh

	this.currentPart = 0

	this.extension = '.mp4'

	this.cycleLength = 10000 + ( Math.random() * 10000 )

	var
	defaultBackgroundMaterial = new THREE.MeshBasicMaterial(
  {
    transparent:true,
    map: THREE.ImageUtils.loadTexture( 'images/bleed/halebopp.png' )
  })

	//todo: for now start currentPart with highest videoCount so enough video sources are added
	this.parts = [
		{
			path: 'media/video/oprah/oprah',
			videoCount: 5,
			videoURLs: [],
			blend: 0,
			scale: .25,
			backgroundMaterial: defaultBackgroundMaterial
		},
		{
			path: 'media/video/issatan/',
			videoCount: 3,
			videoURLs: [],
			blend: 1,
			scale: 1,
			backgroundMaterial: defaultBackgroundMaterial
		},
		{
			path: 'media/video/700/',
			videoCount: 4,
			videoURLs: [],
			blend: 1,
			scale: 1,
			backgroundMaterial: defaultBackgroundMaterial
		},
		{
			path: 'media/video/somany/somany',
			videoCount: 5,
			videoURLs: [],
			blend: 1,
			scale: 1,
			backgroundMaterial: defaultBackgroundMaterial
		},
		{
			path: 'media/video/narc/narc',
			videoCount: 5,
			videoURLs: [],
			blend: 1,
			scale: 1,
			backgroundMaterial: defaultBackgroundMaterial
		},
		
		{
			path: 'media/video/billy/billy',
			videoCount: 18,
			videoURLs: [],
			blend: 1,
			scale: 1,
			backgroundMaterial: defaultBackgroundMaterial
		},
		{
			path: 'media/video/dancinggirls/dancinggirls',
			videoCount: 4,
			videoURLs: [],
			blend: 1,
			scale: 1,
			backgroundMaterial: defaultBackgroundMaterial
		},
		
		{
			path: 'media/video/blackfriday2/blackfriday',
			videoCount: 5,
			videoURLs: [],
			blend: 1,
			scale: .5
		},
		{
			path: 'media/video/satan/satan',
			videoCount: 6,
			videoURLs: [],
			blend: 0,
			scale: .5
		}
	]

	this.maxVideos = 18

	this.speed = 100

	this.videoURLs = []

	this.activeBillys = {}

	this.deltaCount = 0

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
  material.uniforms.uBlend.value = this.parts[ this.currentPart ].blend 


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
	var mesh = new THREE.Mesh( plane, this.activeVideos[ Math.floor( Math.random() * this.parts[ this.currentPart ].videoCount ) ].material )
	mesh.position.set( ( Math.random() * 600 ) - 300,  (Math.random() * 10), Math.random() * this.depth )
	mesh.position.x += ( Math.sin( mesh.position.z /300 ) * Math.sin( mesh.position.z / 900 ) * 200 )
	this.billysObject.add( mesh )
	this.activeBillys[ id ] = {
		mesh: mesh,
		currentPart: this.currentPart
	}
	// this.camera.position.set(0,150,300)

}

Billys.prototype.resetPosition = function( id ) {

	var billy = this.activeBillys[ id ]

	billy.mesh.position.z = Math.random() * 2
	// movieScreen.position.x += ( Math.sin( movieScreen.position.z /300 ) * Math.sin( movieScreen.position.z / 900 ) * 200 )
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
	if( this.tween )
		TWEEN.update()

	for ( var b in this.activeBillys ){
		if( this.activeBillys[ b ].mesh.position.z > 5000 )
			this.resetPosition( b )
		else
			this.activeBillys[ b ].mesh.position.z += delta * this.speed
	}

	this.deltaCount += delta
	this.camera.position.y = -10 + (( ( 50 * Math.sin( this.deltaCount * .5 ) ) - 40 ) +  ( ( 50 * Math.sin( this.deltaCount * .1) ) - 40 ) + ( ( 50 * Math.sin( this.deltaCount * .01) ) - 40 ))
	this.camera.rotation.z += .001 * ( Math.sin( this.deltaCount * .8 ) + Math.sin( this.deltaCount * .05) )
}

Billys.prototype.start = function() {

	
	this.billysObject = new THREE.Object3D()
	// this.billysObject.position.z = -this.depth
	this.billysObject.position.y = 20
	this.billysObject.rotation.x = .035

	this.scene.add( this.billysObject )

	var
	i,
	_this = this

	_.each( this.parts, function( part, key ){

		i = 0

		while( i < part.videoCount ){

			_this.parts[ key ].videoURLs.push( part.path + ( i + 1 ) + _this.extension )
			i++

		}

	})

	this.activeVideos = []

	i = 0
	while( i < this.parts[ this.currentPart ].videoCount ){

		this.addVideo( i, this.parts[ this.currentPart ].videoURLs[ i ], true, 512 )
		i++

	}

	i = 0
	while( i < this.depth / 5 ){

		this.add( i )
		i++

	}

	console.log( this.activeVideos )

	// this.camera.lookAt( this.billysObject.position )
	this.camera.position.z = 5000

	// this.tween = new TWEEN.Tween( this.billysObject.position )
	//         .to( { z: 1000 }, 180000 )
	//         .start()
	        // .onComplete()

	setInterval( function(){

		_this.currentPart = ( _this.currentPart + 1 ) % _this.parts.length

		i = 0

		var video

		while ( i < _this.parts[ _this.currentPart ].videoURLs.length ){

			video = _this.activeVideos[ i ].video
			video.src = _this.parts[ _this.currentPart ].videoURLs[ i ]
			video.loop = true
			video.load()
			video.play()

			_this.activeVideos[ i ].material.uniforms.uBlend.value = _this.parts[ _this.currentPart ].blend

			i++

		}

		for ( var b in _this.activeBillys ){

			_this.activeBillys[ b ].mesh.material = _this.activeVideos[ Math.floor( Math.random() * _this.parts[ _this.currentPart ].videoCount ) ].material
			_this.activeBillys[ b ].mesh.scale.x = _this.activeBillys[ b ].mesh.scale.y = _this.parts[ _this.currentPart ].scale
		}

		_this.backgroundMesh.material =_this.parts[ _this.currentPart ].backgroundMaterial || _this.activeVideos[ Math.floor( Math.random() * _this.parts[ _this.currentPart ].videoCount ) ].material

		console.log( 'new part: ', _this.currentPart )

	}, this.cycleLength )

}

Billys.prototype.stop = function() {

	// if ( this.tween )
	// 	TWEEN.remove( this.tween )

	this.scene.remove( billysObject )

	this.activeVideos = []

}