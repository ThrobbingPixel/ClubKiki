Bleed = function ( params ) {
	
	this.renderer = params.renderer
	this.scene 		= params.scene
	this.camera 	= params.camera

	this.textures = []
	this.currentTextureIndex = 0

	var
	imageCount = 9,
	i = 1

	while( i <= imageCount ){
		this.textures.push( THREE.ImageUtils.loadTexture( 'images/bleed/' + i + '.png' ) )
		i++
	}
	console.log( this.textures )

	var shader = ClubKikiShaders[ 'BleedFeedbackShader' ]

	this.feedbackRenderTarget = new FeedbackRenderTarget({
		renderer: this.renderer,
		size: 1024,
		vertexShader:   shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    uniforms: {}
	})

	this.feedbackRenderTarget.material.uniforms.uColorTex = { type: 't', value: this.textures[ 0 ] }
	this.feedbackRenderTarget.material.uniforms.uColorTex.wrapS = THREE.MirroredRepeatWrapping
	this.feedbackRenderTarget.material.uniforms.uColorTex.wrapT = THREE.MirroredRepeatWrapping
	this.feedbackRenderTarget.material.uniforms.uFeedbackTex.wrapS = THREE.MirroredRepeatWrapping
	this.feedbackRenderTarget.material.uniforms.uFeedbackTex.wrapT = THREE.MirroredRepeatWrapping
	this.feedbackRenderTarget.material.uniforms.uSurfaceTex  = { type: 't', value: THREE.ImageUtils.loadTexture( 'images/bleed/wood.png' ) }


	shader = ClubKikiShaders[ 'BleedDisplayShader' ]

	this.material = new THREE.ShaderMaterial({
    vertexShader:   shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    uniforms: shader.uniforms
  })

  this.material.uniforms.uHistoryTex.value = this.feedbackRenderTarget.texture
	this.material.uniforms.uHistoryTex.wrapS = THREE.MirroredRepeatWrapping
	this.material.uniforms.uHistoryTex.wrapT = THREE.MirroredRepeatWrapping
	this.material.uniforms.uColorTex.value = this.textures[ 0 ]
	this.material.uniforms.uSurfaceTex.value = THREE.ImageUtils.loadTexture( 'images/bleed/wood.png' )

	this.containerObject = new THREE.Object3D()
	this.scene.add( this.containerObject )

	var
	geometry = new THREE.PlaneGeometry( 50, 50, 4, 4 )
	
	this.mesh = new THREE.Mesh( geometry, this.material )
	this.mesh.position.set( 0, 0, -1 )
	this.mesh.scale.set( .9, .9 , 1 )
	this.containerObject.add( this.mesh )

	var
	geometry = new THREE.PlaneGeometry( 50, 50, 4, 4 ),
	frameMaterial = new THREE.MeshBasicMaterial(
	{
		transparent:true,
		map: THREE.ImageUtils.loadTexture( 'images/bleed/frame.png' )
	})
	
	this.frameMesh = new THREE.Mesh( geometry, frameMaterial )
	this.containerObject.add( this.frameMesh )

	this.containerObject.position.set( 0, 0, 260 )

	this.camera.lookAt( this.containerObject.position )

	var _this = this

	setInterval( function(){
		_this.feedbackRenderTarget.clear()
		_this.currentTextureIndex = ( _this.currentTextureIndex + 1 ) % _this.textures.length
		_this.feedbackRenderTarget.material.uniforms.uColorTex = { type: 't', value: _this.textures[ _this.currentTextureIndex ] }
		_this.feedbackRenderTarget.material.uniforms.uColorTex.wrapS = THREE.MirroredRepeatWrapping
		_this.feedbackRenderTarget.material.uniforms.uColorTex.wrapT = THREE.MirroredRepeatWrapping
		_this.feedbackRenderTarget.material.uniforms.uFeedbackTex.wrapS = THREE.MirroredRepeatWrapping
		_this.feedbackRenderTarget.material.uniforms.uFeedbackTex.wrapT = THREE.MirroredRepeatWrapping
		_this.feedbackRenderTarget.material.uniforms.uSurfaceTex  = { type: 't', value: THREE.ImageUtils.loadTexture( 'images/bleed/wood.png' ) }

		_this.material.uniforms.uColorTex.value = _this.textures[ _this.currentTextureIndex ]
	
		_this.material.uniforms.uHistoryTex.value = _this.feedbackRenderTarget.texture
	}, 3000)

}

Bleed.prototype.update = function( delta ) {
	
	this.feedbackRenderTarget.render( delta )
	this.material.uniforms.uHistoryTex.value = this.feedbackRenderTarget.texture

}