// create-scene.ts
import * as THREE from 'three';
import { type SceneConfig, type SceneState } from './types';
import { DEFAULT_CONFIG } from './constants';
import { initRenderer, initScene, initCamera, initCube, initLights } from './scene-setup';

const createScene = (canvasId: string, customConfig: Partial<SceneConfig> = {}) => {
  const config: SceneConfig = { ...DEFAULT_CONFIG, ...customConfig };

  const state: SceneState = {
    renderer: null,
    scene: null,
    camera: null,
    cube: null,
    animationFrameId: null,
    isAnimating: false,
  };

  const updateSize = (): void => {
    if (!state.renderer || !state.camera) return;

    const canvas = state.renderer.domElement;
    const container = canvas.parentElement;
    const width = container?.clientWidth || window.innerWidth;
    const height = container?.clientHeight || window.innerHeight;

    state.camera.aspect = width / height;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(width, height);
  };

  const animate = (): void => {
    if (!state.isAnimating || !state.renderer || !state.scene || !state.camera || !state.cube)
      return;

    state.cube.rotation.x += config.rotationSpeed;
    state.cube.rotation.y += config.rotationSpeed;

    state.renderer.render(state.scene, state.camera);
    state.animationFrameId = requestAnimationFrame(animate);
  };

  const init = (): void => {
    try {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!canvas) throw new Error(`Canvas with id ${canvasId} not found`);

      state.renderer = initRenderer(canvas, config.defaultPixelRatio);
      state.scene = initScene();
      state.camera = initCamera(config, canvas.clientWidth / canvas.clientHeight);
      state.cube = initCube(config);

      state.scene.add(state.cube);
      initLights(state.scene, config);

      state.isAnimating = true;
      animate();

      window.addEventListener('resize', updateSize);
    } catch (error) {
      console.error('Failed to initialize scene:', error);
      cleanup();
    }
  };

  const cleanup = (): void => {
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

    window.removeEventListener('resize', updateSize);

    Object.keys(state).forEach((key) => {
      state[key as keyof SceneState] = null;
    });
  };

  return {
    init,
    cleanup,
  };
};

export default createScene;
