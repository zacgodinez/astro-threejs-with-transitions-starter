import * as THREE from 'three';
import { type SavedState, type SceneState } from './types';

import {
  CAMERA_FIELD_OF_VIEW,
  CAMERA_NEAR_PLANE,
  CAMERA_FAR_PLANE,
  RENDERER_SIZE,
  WHITE_COLOR,
  GRAY_COLOR,
  LIGHT_INTENSITY,
  DEFAULT_Z_POSITION,
} from './constants';

export const createInitialState = (): SceneState => ({
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
});

export const initRenderer = (canvasId: string): THREE.WebGLRenderer | null => {
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

const parseRotation = (savedState: SavedState, cube: THREE.Mesh): void => {
  if (savedState.rotation) {
    const { xAxisRotation, yAxisRotation, zAxisRotation } = savedState.rotation;
    cube.rotation.x = xAxisRotation;
    cube.rotation.y = yAxisRotation;
    cube.rotation.z = zAxisRotation;
  }
};

const parsePosition = (savedState: SavedState, cube: THREE.Mesh): void => {
  if (savedState.position) {
    const { xCoordinate, yCoordinate, zCoordinate } = savedState.position;
    cube.position.x = xCoordinate;
    cube.position.y = yCoordinate;
    cube.position.z = zCoordinate;
  } else {
    cube.position.z = DEFAULT_Z_POSITION;
  }
};

export const createCube = (savedState: SavedState | null): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: WHITE_COLOR,
    flatShading: true,
    transparent: true,
    opacity: 1,
  });

  const cube = new THREE.Mesh(geometry, material);

  if (savedState) {
    parseRotation(savedState, cube);
    parsePosition(savedState, cube);
  } else {
    cube.position.z = DEFAULT_Z_POSITION;
  }

  return cube;
};

export const setupLights = (): THREE.Light[] => {
  const directionalLight = new THREE.DirectionalLight(WHITE_COLOR, LIGHT_INTENSITY);
  directionalLight.position.set(1, 1, 1);

  const ambientLight = new THREE.AmbientLight(GRAY_COLOR);

  return [directionalLight, ambientLight];
};
