import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

import vert from './resources/shader/toon.vert.js';
import frag from './resources/shader/toon.frag.js';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(5.5, 2, 2);

const controls = new OrbitControls(camera, canvas);
controls.target.set(5.5, 1, -7);
controls.update();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const planeSize = 40;

const fileLoader = new THREE.FileLoader();

const toonVertexShader = vert
const toonFragmentShader = frag

const loader = new THREE.TextureLoader();
const rampTexture = loader.load( 'resources/images/ramp.png' );

const toonShaderMaterial = new THREE.ShaderMaterial({
	lights: true,
	uniforms: {
		...THREE.UniformsLib.lights,
		gradientMap: { value: rampTexture },
	},
	vertexShader: toonVertexShader,
	fragmentShader: toonFragmentShader,
})

const repeats = planeSize / 2;
rampTexture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);

const planeMat = new THREE.MeshPhongMaterial({
  map: rampTexture,
  side: THREE.DoubleSide,
});

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial({
  map: rampTexture,
});

const lampMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFCF1A,
})
const sphereRadius = .5;
const sphereWidthDivisions = 16;
const sphereHeightDivisions = 12;
const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

const cube = new THREE.Mesh( sphereGeo, lampMaterial );
cube.position.y = 1
cube.scale.set(.1,.1,.1);
cube.castShadow = false;
scene.add( cube );

const cube2 = new THREE.Mesh( sphereGeo, lampMaterial );
cube2.position.y = 2
cube2.scale.set(.1,.1,.1);
cube2.castShadow = false;
scene.add( cube2 );

const gltfLoader = new GLTFLoader();
const mesh_path = 'resources/DUNGEON_TEST.glb';

gltfLoader.load( mesh_path, function ( gltf ) {
	
	gltf.scene.traverse((o) => {
	  if (o.isMesh) { 
		o.material = toonShaderMaterial;
		o.receiveShadow = true;
		o.castShadow = true;
	  }
	});
	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.receiveShadow = true;
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);

rampTexture.colorSpace = THREE.SRGBColorSpace;

{
	const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
	const mesh = new THREE.Mesh(sphereGeo, toonShaderMaterial);
	mesh.position.y = 1;
	mesh.position.x = 5;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add(mesh);
}

const ambientLight = new THREE.AmbientLight("#222222", 0.5);
scene.add(ambientLight);

renderer.setClearColor( 0x060202, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const color = 0xFFFFFF;
const intensity = 10;

const light = new THREE.PointLight(color, intensity);
light.distance = 5;
light.shadow.bias = 0.001;
light.shadow.normalBias = 0.003;
light.position.y = 1.8
light.position.x = 6
light.castShadow = true;
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 15;

scene.add(light);

const light2 = new THREE.PointLight(color, intensity);
light2.distance = 5;
light2.shadow.bias = 0.001;
light2.shadow.normalBias = 0.003;
light2.position.y = 1
light2.position.x = 6
light2.position.z = -8
light2.castShadow = true;
light2.shadow.camera.near = 0.1;
light2.shadow.camera.far = 15;
light2.shadow.mapSize.width = 4096;
light2.shadow.mapSize.height = 4096;

scene.add(light2);


class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

var i = 0
function animate() {
	requestAnimationFrame( animate );
	
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	
	cube.position.y = light.position.y;
	cube.position.x = light.position.x;
	cube.position.z = light.position.z;

	light.position.z = (Math.sin(i*0.01))*5
	
	cube2.rotation.x += 0.01;
	cube2.rotation.y += 0.01;
	
	cube2.position.y = light2.position.y;
	cube2.position.x = light2.position.x;
	cube2.position.z = light2.position.z;

	
	renderer.render( scene, camera );
	i++
}

animate();