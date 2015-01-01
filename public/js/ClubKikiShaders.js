
ClubKikiShaders = {

	'basic': {

		uniforms: {},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"varying vec2 vUv;",

			"void main() {",

				"gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );",

			"}"

		].join("\n")

	},

	'BleedFeedbackShader': {

		uniforms: {
			"uFeedbackTex": { type: "t", value: null },
			"uColorTex": { type: "t", value: null },
			"uSurfaceTex": { type: "t", value: null },
			"uGravity": { type: "f", value: 0.5 },
			"uClear": { type: "i", value: 0 },
		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"varying vec2 vUv;",

			"uniform sampler2D uFeedbackTex;",

			"uniform sampler2D uColorTex;",

			"uniform sampler2D uSurfaceTex;",

			"uniform float uGravity;",

			"uniform int uClear;",

			"void main() {",

				"vec4 s = texture2D( uSurfaceTex, vUv );",
				"vec4 c = texture2D( uFeedbackTex, vUv );",
				"float smear =  ( 1.0 - ( ( c.r + c.g + c.b ) / 3.0 ) ) * .05;",
				"vec4 f = texture2D( uColorTex, vec2( vUv.x + smear, vUv.y * ( uGravity  + ( -.1 * s.r ) * smear) ) );",				
				"if( uClear == 0 )",
				" gl_FragColor = vec4( mix( c.r, f.r, ( .8 * smear * s.r ) + ( .01 * c.r ) ), 0.0, 0.0, 1.0 );",
				"else",
				"	gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );",

			"}"

		].join("\n")

	},

	'BleedDisplayShader': {

		uniforms: {
			"uHistoryTex": { type: "t", value: null },
			"uColorTex": { type: "t", value: null },
			"uSurfaceTex": { type: "t", value: null },
		},

		vertexShader: [

			"uniform sampler2D uHistoryTex;",

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",

				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D uHistoryTex;",

			"uniform sampler2D uColorTex;",

			"uniform sampler2D uSurfaceTex;",

			"varying vec2 vUv;",

			"void main() {",

				"vec4 h = texture2D( uHistoryTex, vUv );",

				"vec4 s = texture2D( uSurfaceTex, vUv );",

				"vec4 c = texture2D( uColorTex, vec2( vUv.x + ( .1 * s.r ), vUv.y + h.r - ( .1 * s.r ) ) );",

				"gl_FragColor = c  - (c * s);",

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

// ClubKikiShaders = {

// 	'basic': {

// 		uniforms: {},

// 		vertexShader: [

// 			"varying vec2 vUv;",

// 			"void main() {",

// 				"vUv = uv;",

// 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// 			"}"

// 		].join("\n"),

// 		fragmentShader: [

// 			"varying vec2 vUv;",

// 			"void main() {",

// 				"gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );",

// 			"}"

// 		].join("\n")

// 	},

// 	'BleedFeedbackShader': {

// 		uniforms: {
// 			"uFeedbackTex": { type: "t", value: null },
// 			"uColorTex": { type: "t", value: null },
// 			"uSurfaceTex": { type: "t", value: null },
// 			"uGravity": { type: "f", value: 0.01 },
// 			"uClear": { type: "i", value: 0 },
// 		},

// 		vertexShader: [

// 			"varying vec2 vUv;",

// 			"void main() {",

// 				"vUv = uv;",

// 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// 			"}"

// 		].join("\n"),

// 		fragmentShader: [

// 			"varying vec2 vUv;",

// 			"uniform sampler2D uFeedbackTex;",

// 			"uniform sampler2D uColorTex;",

// 			"uniform sampler2D uSurfaceTex;",

// 			"uniform float uGravity;",

// 			"uniform int uClear;",

// 			"void main() {",

// 				"float s = 1.0 - texture2D( uSurfaceTex, vUv ).r;",
// 				"vec4 c = texture2D( uColorTex, vUv );",
// 				"float smear = ( 1.0 - ( ( c.r + c.g + c.b ) / 3.0 ) ) ;",
// 				"vec4 f = texture2D( uFeedbackTex, vec2( vUv.x, vUv.y + uGravity + ( .1 * s * smear ) ) );",
// 				"vec4 m = mix( f, c, .5 );",
// 				"if( uClear == 0 )",
// 				"	gl_FragColor = vec4( m.r, m.g, m.b, 1. );",
// 				"else",
// 				"	gl_FragColor = vec4( m.r, m.g, m.b, 0. );",
// 			"}"

// 		].join("\n")

// 	},

// 	'BleedDisplayShader': {

// 		uniforms: {
// 			"uHistoryTex": { type: "t", value: null },
// 			"uColorTex": { type: "t", value: null },
// 			"uSurfaceTex": { type: "t", value: null },
// 		},

// 		vertexShader: [

// 			"uniform sampler2D uHistoryTex;",

// 			"varying vec2 vUv;",

// 			"void main() {",

// 				"vUv = uv;",

// 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// 			"}"

// 		].join("\n"),

// 		fragmentShader: [

// 			"uniform sampler2D uHistoryTex;",

// 			"uniform sampler2D uColorTex;",

// 			"varying vec2 vUv;",

// 			"void main() {",

// 				"vec4 h = texture2D( uHistoryTex, vUv );",

// 				// "vec4 c = texture2D( uColorTex, vec2( vUv.x, vUv.y + h.r ) );",

// 				"gl_FragColor = h;",

// 			"}"

// 		].join("\n")

// 	},

// 	'RoundFadeShader': {

// 		uniforms: {
// 			"uFade": { type: "f", value: 1.0 },
// 			"uTex": { type: "t", value: null },
// 			'uZoom': { type: "f", value: 1.0 },
// 			"uBlendMode": { type: "i", value: 0 } //0:default, 1:add, 2: subtract, 3:multiply
// 		},

// 		vertexShader: [

// 			"varying vec2 vUv;",

// 			"void main() {",

// 				"vUv = uv;",

// 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// 			"}"

// 		].join("\n"),

// 		fragmentShader: [

// 			"uniform float uFade;",

// 			"uniform sampler2D uTex;",

// 			"uniform float uZoom;",

// 			"varying vec2 vUv;",

// 			"void main() {",

// 				"vec4 c = texture2D( uTex, vec2(  ( ( vUv.x + ( .5 * uZoom ) ) - .5 * uZoom ), ( ( vUv.y + ( .5 * uZoom ) ) - .5 * uZoom ) ) );",

// 				"gl_FragColor = vec4( c.r, c.g, c.b, sqrt( 5.0 * c.r ) * (sqrt( 1.0 - ( 2.0 * distance( vUv, vec2( .5, .5 ) ) ) * uFade )));",

// 			"}"

// 		].join("\n")

// 	},

// 	'USymmetryShader': {

// 		uniforms: {
// 			"uFade": { type: "f", value: 1.0 },
// 			"uTex": { type: "t", value: null },
// 			'uZoom': { type: "f", value: 1.0 },
// 			"uBlendMode": { type: "i", value: 0 } //0:default, 1:add, 2: subtract, 3:multiply
// 		},

// 		vertexShader: [

// 			"varying vec2 vUv;",

// 			"void main() {",

// 				"vUv = uv;",

// 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// 			"}"

// 		].join("\n"),

// 		fragmentShader: [

// 			"uniform float uFade;",

// 			"uniform sampler2D uTex;",

// 			"uniform float uZoom;",

// 			"varying vec2 vUv;",

// 			"void main() {",

// 				"vec4 c = texture2D( uTex, vec2( abs( abs( ( 2.0 * ( ( vUv.x + ( .5 * uZoom ) ) - .5 * uZoom ) ) - 1. ) - 1. ), ( ( vUv.y + ( .5 * uZoom ) ) - .5 * uZoom ) ) );",

// 				"gl_FragColor = vec4( c.r, c.g, c.b, (sqrt( 1.0 - ( 2.0 * distance( vUv, vec2( .5, .5 ) ) ) * uFade )));",

// 			"}"

// 		].join("\n")

// 	}
// };

// // ClubKikiShaders = {

// // 	'basic': {

// // 		uniforms: {},

// // 		vertexShader: [

// // 			"varying vec2 vUv;",

// // 			"void main() {",

// // 				"vUv = uv;",

// // 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// // 			"}"

// // 		].join("\n"),

// // 		fragmentShader: [

// // 			"varying vec2 vUv;",

// // 			"void main() {",

// // 				"gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );",

// // 			"}"

// // 		].join("\n")

// // 	},

// // 	'BleedFeedbackShader': {

// // 		uniforms: {
// // 			"uFeedbackTex": { type: "t", value: null },
// // 			"uColorTex": { type: "t", value: null },
// // 			"uSurfaceTex": { type: "t", value: null },
// // 			"uGravity": { type: "f", value: 0.01 },
// // 		},

// // 		vertexShader: [

// // 			"varying vec2 vUv;",

// // 			"void main() {",

// // 				"vUv = uv;",

// // 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// // 			"}"

// // 		].join("\n"),

// // 		fragmentShader: [

// // 			"varying vec2 vUv;",

// // 			"uniform sampler2D uFeedbackTex;",

// // 			"uniform sampler2D uColorTex;",

// // 			"uniform sampler2D uSurfaceTex;",

// // 			"uniform float uGravity;",

// // 			"void main() {",

// // 				"vec4 s = texture2D( uSurfaceTex, vUv );",
// // 				"vec4 c = texture2D( uColorTex, vUv );",
// // 				"vec4 h = texture2D( uFeedbackTex, vUv );",

// // 				"vec4 m = mix( c, h, .95 );",

// // 				"float smear =  ( 1.0 - ( ( m.r + m.g + m.b ) / 3.0 ) );",
// // 				"vec4 f = texture2D( uFeedbackTex, vec2( vUv.x * ( -.1 * s.r ), vUv.y - ( s.r * 10.0 * smear )));",				

// // 				"gl_FragColor = vec4( m.r, m.g, m.b, mix( m.a, f.a, .1 ) );",

// // 			"}"

// // 		].join("\n")

// // 	},

// // 	'BleedDisplayShader': {

// // 		uniforms: {
// // 			"uHistoryTex": { type: "t", value: null },
// // 			"uColorTex": { type: "t", value: null },
// // 			"uSurfaceTex": { type: "t", value: null },
// // 		},

// // 		vertexShader: [

// // 			"uniform sampler2D uHistoryTex;",

// // 			"varying vec2 vUv;",

// // 			"void main() {",

// // 				"vUv = uv;",

// // 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// // 			"}"

// // 		].join("\n"),

// // 		fragmentShader: [

// // 			"uniform sampler2D uHistoryTex;",

// // 			"uniform sampler2D uColorTex;",

// // 			"varying vec2 vUv;",

// // 			"void main() {",

// // 				"vec4 h = texture2D( uHistoryTex, vUv );",

// // 				"vec4 c = texture2D( uHistoryTex, vec2( vUv.x, vUv.y * h.a ) );",

// // 				"gl_FragColor = vec4( c.r, c.g, c.b, 1.0 );",

// // 			"}"

// // 		].join("\n")

// // 	},

// // 	'RoundFadeShader': {

// // 		uniforms: {
// // 			"uFade": { type: "f", value: 1.0 },
// // 			"uTex": { type: "t", value: null },
// // 			'uZoom': { type: "f", value: 1.0 },
// // 			"uBlendMode": { type: "i", value: 0 } //0:default, 1:add, 2: subtract, 3:multiply
// // 		},

// // 		vertexShader: [

// // 			"varying vec2 vUv;",

// // 			"void main() {",

// // 				"vUv = uv;",

// // 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// // 			"}"

// // 		].join("\n"),

// // 		fragmentShader: [

// // 			"uniform float uFade;",

// // 			"uniform sampler2D uTex;",

// // 			"uniform float uZoom;",

// // 			"varying vec2 vUv;",

// // 			"void main() {",

// // 				"vec4 c = texture2D( uTex, vec2(  ( ( vUv.x + ( .5 * uZoom ) ) - .5 * uZoom ), ( ( vUv.y + ( .5 * uZoom ) ) - .5 * uZoom ) ) );",

// // 				"gl_FragColor = vec4( c.r, c.g, c.b, sqrt( 5.0 * c.r ) * (sqrt( 1.0 - ( 2.0 * distance( vUv, vec2( .5, .5 ) ) ) * uFade )));",

// // 			"}"

// // 		].join("\n")

// // 	},

// // 	'USymmetryShader': {

// // 		uniforms: {
// // 			"uFade": { type: "f", value: 1.0 },
// // 			"uTex": { type: "t", value: null },
// // 			'uZoom': { type: "f", value: 1.0 },
// // 			"uBlendMode": { type: "i", value: 0 } //0:default, 1:add, 2: subtract, 3:multiply
// // 		},

// // 		vertexShader: [

// // 			"varying vec2 vUv;",

// // 			"void main() {",

// // 				"vUv = uv;",

// // 				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

// // 			"}"

// // 		].join("\n"),

// // 		fragmentShader: [

// // 			"uniform float uFade;",

// // 			"uniform sampler2D uTex;",

// // 			"uniform float uZoom;",

// // 			"varying vec2 vUv;",

// // 			"void main() {",

// // 				"vec4 c = texture2D( uTex, vec2( abs( abs( ( 2.0 * ( ( vUv.x + ( .5 * uZoom ) ) - .5 * uZoom ) ) - 1. ) - 1. ), ( ( vUv.y + ( .5 * uZoom ) ) - .5 * uZoom ) ) );",

// // 				"gl_FragColor = vec4( c.r, c.g, c.b, (sqrt( 1.0 - ( 2.0 * distance( vUv, vec2( .5, .5 ) ) ) * uFade )));",

// // 			"}"

// // 		].join("\n")

// // 	}
// // };
