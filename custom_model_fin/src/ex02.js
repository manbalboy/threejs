import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// ----- 주제: glb 애니메이션

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// gltf loader
	const gltfLoader = new GLTFLoader();
	let mixer;

	gltfLoader.load(
		'./models/aaaa.glb',
		gltf => {
			console.log(gltf.animations[1]);
			const ilbuniMesh = gltf.scene.children[0];
			scene.add(ilbuniMesh);

			mixer = new THREE.AnimationMixer(ilbuniMesh);
			const actions = [];
			// actions[1] = mixer.clipAction(gltf.animations[1]);
			// actions[1].clampWhenFinished = true;
			// actions[1].repetitions = 100;
			// actions[1].play();
			actions[0] = mixer.clipAction(gltf.animations[0]);
			actions[0].clampWhenFinished = true;
			actions[0].repetitions = 100;
			actions[0].play();
		}
	);

	

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		if (mixer) mixer.update(delta);

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
