import createScene from "./create-scene";

type SceneManager = {
	init: () => void;
	cleanup: () => void;
};

const CANVAS_ID = "three-js-canvas";
const sceneManager: Record<string, SceneManager> = {};

document.addEventListener("astro:before-swap", () => {
	Object.values(sceneManager).forEach((scene) => scene.cleanup());
});

document.addEventListener("astro:page-load", () => {
	sceneManager[CANVAS_ID] = createScene(CANVAS_ID);
	sceneManager[CANVAS_ID].init();
});
