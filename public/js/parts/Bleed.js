Bleed = function ( params ) {
	
	this.renderer = params.renderer
	this.scene 		= params.scene

	this.textures = []
	this.currentTextureIndex = 0

	var
	imageCount = 3,
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
	this.feedbackRenderTarget.material.uniforms.uSurfaceTex  = { type: 't', value: THREE.ImageUtils.loadTexture( 'images/bleed/wood.png' ) }


	shader = ClubKikiShaders[ 'BleedDisplayShader' ]

	this.material = new THREE.ShaderMaterial({
    vertexShader:   shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    uniforms: shader.uniforms
  })

  this.material.uniforms.uHistoryTex.value = this.feedbackRenderTarget.texture
	this.material.uniforms.uColorTex.value = this.textures[ 0 ]
	this.material.uniforms.uSurfaceTex.value = THREE.ImageUtils.loadTexture( 'images/bleed/wood.png' )


	var
	geometry = new THREE.PlaneGeometry( 50, 50, 4, 4 )
	
	this.mesh = new THREE.Mesh( geometry, this.material )

	this.mesh.position.set( 0, 0, -30 )
	this.scene.add( this.mesh )

	var _this = this

	setInterval( function(){
		_this.currentTextureIndex = ( _this.currentTextureIndex + 1 ) % _this.textures.length
		_this.feedbackRenderTarget.material.uniforms.uColorTex.value = _this.textures[ _this.currentTextureIndex ]
		_this.material.uniforms.uColorTex.value = _this.textures[ _this.currentTextureIndex ]
	
	}, 1000)

}

Bleed.prototype.update = function( delta ) {
	
	this.feedbackRenderTarget.render( delta )
	this.material.uniforms.uHistoryTex = this.feedbackRenderTarget.texture

}