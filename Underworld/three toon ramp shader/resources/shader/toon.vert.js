const vert = `
//#include <common>

varying vec3 vNormal;
varying vec3 vViewPosition;

struct PointLightShadow {
	float shadowBias;
	float shadowNormalBias;
	float shadowRadius;
	vec2 shadowMapSize;
	float shadowCameraNear;
	float shadowCameraFar;
};

#if ( NUM_POINT_LIGHT_SHADOWS > 0 )

uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
#endif

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {

	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal

	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );

}

void main() {
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);
	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 clipPosition = projectionMatrix * viewPosition;

	vec3 transformed = vec3( position );
	
	
	vec3 objectNormal = vec3( normal );
	vec3 transformedNormal = objectNormal;
	transformedNormal = normalMatrix * transformedNormal;
	vNormal = normalize( transformedNormal );

	
	
	//vec4 mvPosition = vec4( transformed, 1.0 );
	//mvPosition = modelViewMatrix * mvPosition;

	//vNormal = normalize(normalMatrix * normal);
	//vNormal = normalize( vNormal );
	//normal = normalize( vNormal );

	//gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	//gl_Position = clipPosition;
  	vec4 mvPosition = vec4( transformed, 1.0 );
	mvPosition = modelViewMatrix * mvPosition;

  	vViewPosition = mvPosition.xyz;
	vec4 worldPosition = vec4( transformed, 1.0 );
	worldPosition = modelMatrix * worldPosition;
	
	gl_Position = projectionMatrix * mvPosition;

	
	vViewPosition = - mvPosition.xyz;

	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
	
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

		shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
		vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;

	}
	#pragma unroll_loop_end
}
`
export default vert