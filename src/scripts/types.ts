import * as THREE from 'three';

export type SceneState = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer | null;
  cube: THREE.Mesh | null;
  animationId: number | null;
};

export type SavedState = {
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
