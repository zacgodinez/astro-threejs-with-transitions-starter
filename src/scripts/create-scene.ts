import { type SceneState } from './types';
import { ROTATION_SPEED } from './constants';
import { saveState, loadSavedState } from './storage-utils';
import {
  createInitialState,
  initRenderer,
  createCube,
  setupLights,
} from './scene-setup';

const createScene = (canvasId: string) => {
  const state: SceneState = createInitialState();

  const animate = (): void => {
    if (!state.cube || !state.renderer) return;

    state.cube.rotation.x += ROTATION_SPEED;
    state.cube.rotation.y += ROTATION_SPEED;

    state.renderer.render(state.scene, state.camera);
    state.animationId = requestAnimationFrame(animate);

    saveState(state.cube, canvasId);
  };

  const init = (): void => {
    state.renderer = initRenderer(canvasId);
    if (!state.renderer) return;

    const savedState = loadSavedState(canvasId);
    state.cube = createCube(savedState);
    state.camera.position.z = 0;
    state.scene.add(state.cube);

    const lights = setupLights();
    lights.forEach((light) => state.scene.add(light));

    animate();
  };

  const cleanup = (): void => {
    if (state.cube) {
      saveState(state.cube, canvasId);
      state.cube.geometry.dispose();
    }

    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
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
