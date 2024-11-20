import * as THREE from 'three';
import { type SceneConfig } from './types';

const DEFAULT_PIXEL_RATIO = 2;
const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const LIGHT_COLOR = 0xffffff;
const AMBIENT_LIGHT_INTENSITY = 0.5;
const DIRECTIONAL_LIGHT_POSITION_X = 5;
const DIRECTIONAL_LIGHT_POSITION_Y = 5;
const DIRECTIONAL_LIGHT_POSITION_Z = 5;
const CUBE_SIZE = 2.5;
const CUBE_COLOR = 0x00ff00;
const ROTATION_SPEED = 0.01;

export const DEFAULT_CONFIG: SceneConfig = {
  cameraFov: CAMERA_FOV,
  cameraNear: CAMERA_NEAR,
  cameraFar: CAMERA_FAR,
  lightColor: LIGHT_COLOR,
  ambientLightIntensity: AMBIENT_LIGHT_INTENSITY,
  directionalLightPosition: new THREE.Vector3(
    DIRECTIONAL_LIGHT_POSITION_X,
    DIRECTIONAL_LIGHT_POSITION_Y,
    DIRECTIONAL_LIGHT_POSITION_Z,
  ),
  cubeSize: CUBE_SIZE,
  cubeColor: CUBE_COLOR,
  rotationSpeed: ROTATION_SPEED,
  defaultPixelRatio: DEFAULT_PIXEL_RATIO,
};
