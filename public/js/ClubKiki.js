ClubKiki = function ( params ){

  this.clock = new THREE.Clock()

  console.log( 'ClubKiki', params )

  this.useVR = params.useVR

  this.windowWidth = window.innerWidth
  this.windowHeight = window.innerHeight

  this.init()

}

ClubKiki.prototype.render = function(){

  // this.controls.update()

  var 
  delta = this.clock.getDelta(),
  _this = this

 // this.composer.render()
 this.renderer.render(  this.scene, this.camera )

  _.each( this.activeParts, function( part ){

    part.update( delta )

  })

  requestAnimationFrame( this.render.bind( this ) )

}

ClubKiki.prototype.init = function() {

  var _this = this

  this.scene = new THREE.Scene()

  this.camera = new THREE.PerspectiveCamera( 45, this.windowWidth / this.windowHeight, 5, 10000 )
  // this.camera.position.set( 0, 5, 300)

  this.renderer = new THREE.WebGLRenderer({ antialias: true })
  this.renderer.setSize( this.windowWidth, this.windowHeight, false )
  // this.renderer.setClearColor(0xffffff, 1)

  this.bluriness = .3
  this.blurRadius = 2

  // Configure composer
  // Prepare the composer's render target
  var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false }
  this.renderTarget = new THREE.WebGLRenderTarget( this.windowWidth, this.windowHeight, renderTargetParameters )

  this.composer = new THREE.EffectComposer( this.renderer )
  this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) )

  this.hblur = new THREE.ShaderPass( THREE.HorizontalTiltShiftShader )
  this.hblur.uniforms[ 'h' ].value = this.bluriness / this.windowWidth
  this.hblur.uniforms[ 'r' ].value = this.blurRadius
  this.composer.addPass( this.hblur )

  this.vblur = new THREE.ShaderPass( THREE.VerticalTiltShiftShader )
  this.vblur.uniforms[ 'v' ].value  = this.bluriness / this.windowHeight
  this.vblur.uniforms[ 'r' ].value = this.blurRadius
  this.composer.addPass( this.vblur )

  // this.composer.addPass( new THREE.BloomPass( 0.5, 5, 1 ) )

  var copyPass = new THREE.ShaderPass( THREE.CopyShader )
  copyPass.renderToScreen = true
  this.composer.addPass( copyPass )


  document.querySelector( '#main' ).appendChild( this.renderer.domElement )
    

  var
  geometry = new THREE.PlaneGeometry( 9000, 9000, 4, 4 ),
  material = new THREE.MeshBasicMaterial(
  {
    transparent:true,
    map: THREE.ImageUtils.loadTexture( 'images/bleed/halebopp.png' )
  })

  this.backgroundMesh = new THREE.Mesh( geometry, material )
  this.backgroundMesh.position.z = -1000
  this.scene.add( this.backgroundMesh )
  
  this.controls = new THREE.OrbitControls( this.camera )

  this.parts = {
    'Billys': Billys,
    'ClassicDudes': ClassicDudes,
    'BlackFriday': BlackFriday,
    'Bleed': Bleed
  }

  this.activeParts = []

  this.start()

}

ClubKiki.prototype.onStopHandler = function( part ){
  console.log( part )
}

ClubKiki.prototype.start = function(){

  var
  params = {
    camera: this.camera,
    scene: this.scene,
    renderer: this.renderer,
    onStopCallback: this.onStopHandler,
    backgroundMesh: this.backgroundMesh
  }

  // this.activeParts.push( new this.parts[ 'Bleed' ]( params ) )

  this.activeParts.push( new this.parts[ 'Billys' ]( params ) )

  // this.activeParts.push( new this.parts[ 'BlackFriday' ]( params ) )

  // this.activeParts.push( new this.parts[ 'ClassicDudes' ]( params ) )

  this.render()
}
