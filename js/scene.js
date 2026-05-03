import { editableParts } from './parts.js';
import { saveOriginalTransform } from './state.js';

export function createScene({ engine, canvas, state, onSelectPart }) {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.01, 0.04, 0.09, 1);

  createCamera(scene, canvas);
  createLights(scene);
  createGround(scene);
  createEditableObject(scene, state);

  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type !== BABYLON.PointerEventTypes.POINTERPICK) return;
    const picked = pointerInfo.pickInfo?.pickedMesh;
    const part = state.parts.find((item) => item.mesh === picked);
    if (part) onSelectPart(part.id);
  });

  onSelectPart('body');
  return scene;
}

function createCamera(scene, canvas) {
  const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2.3, 1.1, 14, new BABYLON.Vector3(0, 1.6, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 7;
  camera.upperRadiusLimit = 24;
  camera.wheelDeltaPercentage = 0.01;
}

function createLights(scene) {
  const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
  hemi.intensity = 0.95;
  const dir = new BABYLON.DirectionalLight('dir', new BABYLON.Vector3(-1, -2, -1), scene);
  dir.position = new BABYLON.Vector3(8, 10, 8);
  dir.intensity = 0.7;
}

function createGround(scene) {
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene);
  const grid = new BABYLON.GridMaterial('gridMat', scene);
  grid.majorUnitFrequency = 5;
  grid.minorUnitVisibility = 0.35;
  grid.gridRatio = 1;
  grid.backFaceCulling = false;
  grid.mainColor = new BABYLON.Color3(0.22, 0.3, 0.38);
  grid.lineColor = new BABYLON.Color3(0.4, 0.52, 0.62);
  grid.opacity = 0.65;
  ground.material = grid;
}

function createEditableObject(scene, state) {
  const parent = new BABYLON.TransformNode('editableObject', scene);
  state.parts = editableParts.map((definition) => {
    const mesh = BABYLON.MeshBuilder.CreateBox(definition.id, definition.size, scene);
    mesh.position = new BABYLON.Vector3(definition.position.x, definition.position.y, definition.position.z);
    mesh.parent = parent;
    mesh.material = createMaterial(scene, definition.color);
    mesh.isPickable = true;

    const part = { ...definition, mesh };
    saveOriginalTransform(state, part);
    return part;
  });
}

function createMaterial(scene, hex) {
  const mat = new BABYLON.StandardMaterial(`mat-${hex}`, scene);
  mat.diffuseColor = BABYLON.Color3.FromHexString(hex);
  mat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  return mat;
}
