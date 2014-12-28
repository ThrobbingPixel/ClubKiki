
ClubKikiShaders = {

	'basic': {

		uniforms: {},

		vertexShader: [

			"void main() {",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"void main() {",

				"gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );",

			"}"

		].join("\n")

	},

	'RoundFadeShader': {

		uniforms: {
			"uFade": { type: "f", value: 1.0 },
			"uTex": { type: "t", value: null },
			'uZoom': { type: "f", value: 1.0 },
			"uBlendMode": { type: "i", value: 0 } //0:default, 1:add, 2: subtract, 3:multiply
		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float uFade;",

			"uniform sampler2D uTex;",

			"uniform float uZoom;",

			"varying vec2 vUv;",

			"void main() {",

				"vec4 c = texture2D( uTex, vec2(  ( ( vUv.x + ( .5 * uZoom ) ) - .5 * uZoom ), ( ( vUv.y + ( .5 * uZoom ) ) - .5 * uZoom ) ) );",

				"gl_FragColor = vec4( c.r, c.g, c.b, sqrt( 5.0 * c.r ) * (sqrt( 1.0 - ( 2.0 * distance( vUv, vec2( .5, .5 ) ) ) * uFade )));",

			"}"

		].join("\n")

	},

	'USymmetryShader': {

		uniforms: {
			"uFade": { type: "f", value: 1.0 },
			"uTex": { type: "t", value: null },
			'uZoom': { type: "f", value: 1.0 },
			"uBlendMode": { type: "i", value: 0 } //0:default, 1:add, 2: subtract, 3:multiply
		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float uFade;",

			"uniform sampler2D uTex;",

			"uniform float uZoom;",

			"varying vec2 vUv;",

			"void main() {",

				"vec4 c = texture2D( uTex, vec2( abs( abs( ( 2.0 * ( ( vUv.x + ( .5 * uZoom ) ) - .5 * uZoom ) ) - 1. ) - 1. ), ( ( vUv.y + ( .5 * uZoom ) ) - .5 * uZoom ) ) );",

				"gl_FragColor = vec4( c.r, c.g, c.b, (sqrt( 1.0 - ( 2.0 * distance( vUv, vec2( .5, .5 ) ) ) * uFade )));",

			"}"

		].join("\n")

	}
};
