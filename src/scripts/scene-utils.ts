import * as THREE from 'three';

import { type SceneConfig } from './types';

export const updateSceneSize = (renderer: THREE.Renderer, camera: THREE.Camera): void => {
  if (!renderer || !camera) return;

  const canvas = renderer.domElement;
  const container = canvas.parentElement;
  const width = container?.clientWidth || window.innerWidth;
  const height = container?.clientHeight || window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

export const createAnimationLoop = (
  config: SceneConfig,
  state: {
    isAnimating: boolean;
    renderer?: THREE.Renderer;
    scene?: THREE.Scene;
    camera?: THREE.Camera;
    cube?: THREE.Mesh;
  },
): (() => void) => {
  const animate = (): void => {
    if (!state.isAnimating || !state.renderer || !state.scene || !state.camera || !state.cube)
      return;

    state.cube.rotation.x += config.rotationSpeed;
    state.cube.rotation.y += config.rotationSpeed;

    state.renderer.render(state.scene, state.camera);
    state.animationFrameId = requestAnimationFrame(animate);
  };

  return animate;
};
