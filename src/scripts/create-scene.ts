import { type SceneConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import { createSceneStateManager } from './scene-state-manager';
import { initRenderer, initScene, initCamera, initCube, initLights } from './scene-setup';

const createScene = (canvasId: string, customConfig: Partial<SceneConfig> = {}) => {
  const config: SceneConfig = { ...DEFAULT_CONFIG, ...customConfig };
  const { getState, setState, cleanup: stateCleanup } = createSceneStateManager();

  const updateSize = (): void => {
    const { renderer, camera } = getState();
    if (!renderer || !camera) return;

    const container = renderer.domElement.parentElement;
    const width = container?.clientWidth || window.innerWidth;
    const height = container?.clientHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const animate = (): void => {
    const state = getState();
    if (!state.isAnimating || !state.renderer || !state.scene || !state.camera || !state.cube) {
      return;
    }

    state.cube.rotation.x += config.rotationSpeed;
    state.cube.rotation.y += config.rotationSpeed;

    state.renderer.render(state.scene, state.camera);
    setState({ animationFrameId: requestAnimationFrame(animate) });
  };

  const init = (): void => {
    try {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      const renderer = initRenderer(canvas, config.defaultPixelRatio);
      const scene = initScene();
      const camera = initCamera(config, canvas.clientWidth / canvas.clientHeight);
      const cube = initCube(config);

      scene.add(cube);
      initLights(scene, config);

      setState({
        renderer,
        scene,
        camera,
        cube,
        isAnimating: true,
      });

      animate();

      window.addEventListener('resize', updateSize);
    } catch (error) {
      console.error('Failed to initialize scene:', error);
      cleanup();
    }
  };

  const cleanup = (): void => {
    const state = getState();
    state.isAnimating = false;

    if (state.animationFrameId !== null) {
      cancelAnimationFrame(state.animationFrameId);
    }

    window.removeEventListener('resize', updateSize);
    stateCleanup();
  };

  return {
    init,
    cleanup,
  };
};

export default createScene;
