import * as THREE from 'three';

import { type SavedState } from './types';


export const createLocalStorageKey = (canvasId: string): string =>
  `cube-state-${canvasId}`;

export const loadSavedState = (canvasId: string): SavedState | null => {
  try {
    const savedState = localStorage.getItem(createLocalStorageKey(canvasId));
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.warn('Error loading saved state:', error);
    return null;
  }
};

export const saveState = (
  cube: THREE.Mesh,
  canvasId: string
): void => {
  const stateToSave: SavedState = {
    rotation: {
      xAxisRotation: cube.rotation.x,
      yAxisRotation: cube.rotation.y,
      zAxisRotation: cube.rotation.z,
    },
    position: {
      xCoordinate: cube.position.x,
      yCoordinate: cube.position.y,
      zCoordinate: cube.position.z,
    },
  };

  try {
    localStorage.setItem(
      createLocalStorageKey(canvasId),
      JSON.stringify(stateToSave)
    );
  } catch (error) {
    console.warn('Error saving state:', error);
  }
};
