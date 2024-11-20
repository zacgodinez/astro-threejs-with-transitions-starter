import * as THREE from 'three';

export interface SceneConfig {
  cameraFov: number;
  cameraNear: number;
  cameraFar: number;
  lightColor: number;
  ambientLightIntensity: number;
  directionalLightPosition: THREE.Vector3;
  cubeSize: number;
  cubeColor: number;
  rotationSpeed: number;
  defaultPixelRatio: number;
}

export interface SceneState {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  cube: THREE.Mesh | null;
  animationFrameId: number | null;
  isAnimating: boolean;
}
