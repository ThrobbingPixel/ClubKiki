ClassicDudes = function( params ){

	this.scene = params.scene
	this.camera = params.camera

	this.drawCircle( 1000, 100 )
	
}

ClassicDudes.prototype.drawCircle = function( radius, segments ) {

	var
	geometry = new THREE.CircleGeometry( radius, segments ),
	mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) )

	mesh.position.z = -5000
	this.scene.add( mesh )

}

ClassicDudes.prototype.update = function( delta ) {

}

ClassicDudes.prototype.start = function() {

}

ClassicDudes.prototype.stop = function() {

}