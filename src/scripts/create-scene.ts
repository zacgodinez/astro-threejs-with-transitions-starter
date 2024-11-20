import * as THREE from 'three';

const CAMERA_FIELD_OF_VIEW = 75;
const CAMERA_NEAR_PLANE = 0.1;
const CAMERA_FAR_PLANE = 1000;
const RENDERER_SIZE = 800;
const WHITE_COLOR = 0xffffff;
const GRAY_COLOR = 0x404040;
const LIGHT_INTENSITY = 1;
const ROTATION_SPEED = 0.01;
const DEFAULT_Z_POSITION = -2;

type SceneState = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer | null;
  cube: THREE.Mesh | null;
  animationId: number | null;
};

type SavedState = {
  rotation?: {
    xAxisRotation: number;
    yAxisRotation: number;
    zAxisRotation: number;
  };
  position?: {
    xCoordinate: number;
    yCoordinate: number;
    zCoordinate: number;
  };
};

const createScene = (canvasId: string) => {
  const state: SceneState = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(
      CAMERA_FIELD_OF_VIEW,
      1,
      CAMERA_NEAR_PLANE,
      CAMERA_FAR_PLANE
    ),
    renderer: null,
    cube: null,
    animationId: null,
  };

  const loadSavedState = (): SavedState | null => {
    try {
      const savedState = localStorage.getItem(`cube-state-${canvasId}`);
      return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
      console.warn('Error loading saved state:', error);
      return null;
    }
  };

  const saveState = (): void => {
    if (!state.cube) return;

    const stateToSave: SavedState = {
      rotation: {
        xAxisRotation: state.cube.rotation.x,
        yAxisRotation: state.cube.rotation.y,
        zAxisRotation: state.cube.rotation.z,
      },
      position: {
        xCoordinate: state.cube.position.x,
        yCoordinate: state.cube.position.y,
        zCoordinate: state.cube.position.z,
      },
    };

    try {
      localStorage.setItem(`cube-state-${canvasId}`, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Error saving state:', error);
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
    renderer.setSize(RENDERER_SIZE, RENDERER_SIZE);
    renderer.setClearColor(0x000000, 0);
    return renderer;
  };

  const createCube = (savedState: SavedState | null): THREE.Mesh => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: WHITE_COLOR,
      flatShading: true,
      transparent: true,
      opacity: 1,
    });

    const cube = new THREE.Mesh(geometry, material);

    if (savedState) {
      if (savedState.rotation) {
        cube.rotation.x = savedState.rotation.xAxisRotation;
        cube.rotation.y = savedState.rotation.yAxisRotation;
        cube.rotation.z = savedState.rotation.zAxisRotation;
      }

      if (savedState.position) {
        cube.position.x = savedState.position.xCoordinate;
        cube.position.y = savedState.position.yCoordinate;
        cube.position.z = savedState.position.zCoordinate;
      }
    } else {
      cube.position.z = DEFAULT_Z_POSITION;
    }

    return cube;
  };

  const setupLights = (): THREE.Light[] => {
    const directionalLight = new THREE.DirectionalLight(WHITE_COLOR, LIGHT_INTENSITY);
    directionalLight.position.set(1, 1, 1);

    const ambientLight = new THREE.AmbientLight(GRAY_COLOR);

    return [directionalLight, ambientLight];
  };

  const animate = (): void => {
    if (!state.cube || !state.renderer) return;

    state.cube.rotation.x += ROTATION_SPEED;
    state.cube.rotation.y += ROTATION_SPEED;

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
