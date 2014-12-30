FeedbackRenderTarget = function ( params ){

	_.defaults( params, {
		size: 512,
		uniforms: {}
	})

	this.size 					= params.size

  this.uniforms 			= params.uniforms
  this.vertexShader 	= params.vertexShader
  this.fragmentShader = params.fragmentShader
  this.renderer 			= params.renderer

	this.scene = new THREE.Scene()

	var renderTargetParams = {
    minFilter:THREE.LinearFilter,
    stencilBuffer:false,
    depthBuffer:false
   }

	this.texture 			= new THREE.WebGLRenderTarget( this.size, this.size, renderTargetParams )
	this.textureClone = new THREE.WebGLRenderTarget( this.size, this.size, renderTargetParams )

  this.camera = new THREE.OrthographicCamera( this.size / - 2, this.size / 2, this.size / 2, this.size / - 2, -10000, 10000 )

  this.uniforms.uFeedbackTex = { type: 't', value: this.texture }

	this.material = new THREE.ShaderMaterial({
	  uniforms: this.uniforms,
	  vertexShader: this.vertexShader,
	  fragmentShader: this.fragmentShader
	}),
	geometry = new THREE.PlaneGeometry( this.size, this.size ),
	mesh = new THREE.Mesh( geometry, this.material )

	mesh.position.z = -100
	this.scene.add( mesh )

}

FeedbackRenderTarget.prototype.render = function () {

	var clone = this.texture
  
  this.texture = this.textureClone
  this.textureClone = clone
  this.material.uniforms.uFeedbackTex.value = clone

	this.renderer.render( this.scene, this.camera, this.texture, true )

}