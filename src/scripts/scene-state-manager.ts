import * as THREE from 'three';
import { type SceneState } from './types';

export const createSceneStateManager = () => {
  let state: SceneState = {
    renderer: null,
    scene: null,
    camera: null,
    cube: null,
    animationFrameId: null,
    isAnimating: false,
  };

  const getState = () => state;

  const setState = (updates: Partial<SceneState>) => {
    state = { ...state, ...updates };
  };

  const cleanup = () => {
    state.isAnimating = false;

    if (state.animationFrameId !== null) {
      cancelAnimationFrame(state.animationFrameId);
    }

    if (state.scene) {
      state.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }

    if (state.renderer) {
      state.renderer.dispose();
      state.renderer.forceContextLoss();
    }
  };

  return {
    getState,
    setState,
    cleanup,
  };
};
