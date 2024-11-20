import * as THREE from 'three';
import { type SceneConfig } from './types';

const SHADOW_MAP_SIZE = 1024;
const SHADOW_CAMERA_NEAR = 0.1;
const SHADOW_CAMERA_FAR = 20;

export const initRenderer = (
  canvas: HTMLCanvasElement,
  defaultPixelRatio: SceneConfig['defaultPixelRatio'],
): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });

  const container = canvas.parentElement;
  const width = container?.clientWidth || window.innerWidth;
  const height = container?.clientHeight || window.innerHeight;

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, defaultPixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  return renderer;
};

export const initScene = (): THREE.Scene => {
  const scene = new THREE.Scene();
  scene.background = null;
  return scene;
};

export const initCamera = (config: SceneConfig, aspect: number): THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(
    config.cameraFov,
    aspect,
    config.cameraNear,
    config.cameraFar,
  );
  camera.position.z = 5;
  return camera;
};

export const initCube = (config: SceneConfig): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(config.cubeSize, config.cubeSize, config.cubeSize);

  const material = new THREE.MeshStandardMaterial({
    color: config.cubeColor,
    roughness: 0.7,
    metalness: 0.3,
  });

  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;

  return cube;
};

export const initLights = (scene: THREE.Scene, config: SceneConfig): void => {
  const ambientLight = new THREE.AmbientLight(config.lightColor, config.ambientLightIntensity);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(config.lightColor, 1);
  directionalLight.position.copy(config.directionalLightPosition);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = SHADOW_MAP_SIZE;
  directionalLight.shadow.mapSize.height = SHADOW_MAP_SIZE;
  directionalLight.shadow.camera.near = SHADOW_CAMERA_NEAR;
  directionalLight.shadow.camera.far = SHADOW_CAMERA_FAR;

  scene.add(directionalLight);
};
