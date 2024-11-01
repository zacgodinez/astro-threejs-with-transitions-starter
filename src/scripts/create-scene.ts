import * as THREE from "three";

type SceneState = {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer | null;
	cube: THREE.Mesh | null;
	animationId: number | null;
};

type SavedState = {
	rotation?: {
		x: number;
		y: number;
		z: number;
	};
	position?: {
		x: number;
		y: number;
		z: number;
	};
};

const createScene = (canvasId: string) => {
	const state: SceneState = {
		scene: new THREE.Scene(),
		camera: new THREE.PerspectiveCamera(75, 1, 0.1, 1000),
		renderer: null,
		cube: null,
		animationId: null,
	};

	const loadSavedState = (): SavedState | null => {
		try {
			const savedState = localStorage.getItem(`cube-state-${canvasId}`);
			if (savedState) {
				return JSON.parse(savedState);
			}
		} catch (error) {
			console.warn("Error loading saved state:", error);
		}
		return null;
	};

	const saveState = (): void => {
		if (!state.cube) return;

		const stateToSave: SavedState = {
			rotation: {
				x: state.cube.rotation.x,
				y: state.cube.rotation.y,
				z: state.cube.rotation.z,
			},
			position: {
				x: state.cube.position.x,
				y: state.cube.position.y,
				z: state.cube.position.z,
			},
		};

		try {
			localStorage.setItem(`cube-state-${canvasId}`, JSON.stringify(stateToSave));
		} catch (error) {
			console.warn("Error saving state:", error);
		}
	};

	const initRenderer = (): THREE.WebGLRenderer | null => {
		const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		if (!canvas) return null;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
			alpha: true,
		});
		renderer.setSize(800, 800);
		renderer.setClearColor(0x000000, 0);
		return renderer;
	};

	const createCube = (savedState: SavedState | null): THREE.Mesh => {
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshPhongMaterial({
			color: 0xf2f2f2,
			flatShading: true,
			transparent: true,
			opacity: 1,
		});

		const cube = new THREE.Mesh(geometry, material);

		if (savedState) {
			if (savedState.rotation) {
				cube.rotation.x = savedState.rotation.x;
				cube.rotation.y = savedState.rotation.y;
				cube.rotation.z = savedState.rotation.z;
			}

			if (savedState.position) {
				cube.position.x = savedState.position.x;
				cube.position.y = savedState.position.y;
				cube.position.z = savedState.position.z;
			}
		} else {
			cube.position.z = -2;
		}

		return cube;
	};

	const setupLights = (): THREE.Light[] => {
		const light1 = new THREE.DirectionalLight(0xffffff, 1);
		light1.position.set(1, 1, 1);
		const light2 = new THREE.AmbientLight(0x404040);
		return [light1, light2];
	};

	const animate = (): void => {
		if (!state.cube || !state.renderer) return;

		state.cube.rotation.x += 0.01;
		state.cube.rotation.y += 0.01;

		state.renderer.render(state.scene, state.camera);
		state.animationId = requestAnimationFrame(animate);

		saveState();
	};

	const init = (): void => {
		state.renderer = initRenderer();
		if (!state.renderer) return;

		const savedState = loadSavedState();
		state.cube = createCube(savedState);
		state.camera.position.z = 0;
		state.scene.add(state.cube);

		const lights = setupLights();
		lights.forEach((light) => state.scene.add(light));

		animate();
	};

	const cleanup = (): void => {
		saveState();

		if (state.animationId) {
			cancelAnimationFrame(state.animationId);
		}

		if (state.cube) {
			state.cube.geometry.dispose();
		}

		if (state.renderer) {
			state.renderer.dispose();
		}
	};

	return {
		init,
		cleanup,
	};
};

export default createScene;
