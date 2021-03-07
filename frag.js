const frag = `
#ifdef GL_ES
precision highp float;
#endif

${includes}

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D image;

//new strength uniform
uniform float strength;

varying vec3 v_normal;
varying vec2 v_texcoord;

	//prevent the edges from stretching when we sample
  vec4 sampleColor(vec2 uv){
      vec4 color = texture2D(image, uv);
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0){
          color = vec4(0.0);
      }
      return color;
  }

void main(void)
{
    //sample  based on pixels - not texture res 
    vec2 uv = (gl_FragCoord.xy - (100.00 * 2.0))/(u_resolution.xy - (200.0)*2.0);
    //uv.y = 1.0 - uv.y;
    
    //we love a distort function 
    //strength is our own param - that's what will make the images
    //jump into one when scrolled
    vec2 distort = 0.04 * strength * vec2(
        sin(u_time + uv.x * 8.0  + uv.y * 3.0), 
        cos(u_time + uv.x * 8.0 + uv.y * 2.0)
    );
    //contraining the noise to only between 0.9 and 1.1 (normal is 1)
    distort *= mix(0.9, 1.3, rand(uv));
    
    
    //these three channels together make up each color layer

		vec4 blackChannel = sampleColor(uv + distort * rotate2d(4.0));
		blackChannel.r = 0.0;
		blackChannel.g = 0.0;
		blackChannel.b = 0.0;
    
    vec4 redChannel = sampleColor(uv + distort * rotate2d(1.0));
    redChannel.g = 0.0;
    redChannel.b = 0.0;
		redChannel.a = redChannel.r;
    
    vec4 greenChannel = sampleColor(uv + distort * rotate2d(2.0));
    greenChannel.r = 0.0;
    greenChannel.b = 0.0;
		greenChannel.a = greenChannel.r;
    
    vec4 blueChannel = sampleColor(uv - distort * rotate2d(3.0));
    blueChannel.r = 0.0;
    blueChannel.g = 0.0;
		blueChannel.a = blueChannel.b;
    
    //and mix em back together
    vec4 color = blackChannel + redChannel + greenChannel + blueChannel;
    
    gl_FragColor = color;
}
`