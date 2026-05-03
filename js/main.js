import { createEditorState } from './state.js';
import { createScene } from './scene.js';
import { createEditorUi } from './ui.js';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const state = createEditorState();

const ui = createEditorUi({
  state,
  elements: {
    partList: document.getElementById('partList'),
    selectedMeta: document.getElementById('selectedMeta'),
    positionControls: document.getElementById('positionControls'),
    scaleControls: document.getElementById('scaleControls'),
    resetPart: document.getElementById('resetPart'),
    resetScene: document.getElementById('resetScene'),
  },
});

const scene = createScene({ engine, canvas, state, onSelectPart: ui.selectPart });
ui.bindResetActions();

engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());
