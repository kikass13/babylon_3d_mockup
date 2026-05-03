import { resetAllTransforms, resetPartTransform } from './state.js';

export function createEditorUi({ state, elements }) {
  function selectPart(id) {
    state.selectedPart = state.parts.find((item) => item.id === id) || null;
    renderPartList();
    highlightSelectedMesh();
    renderTransformControls();
    updateSelectedMeta();
  }

  function bindResetActions() {
    elements.resetPart.addEventListener('click', () => {
      if (!state.selectedPart) return;
      resetPartTransform(state, state.selectedPart);
      renderTransformControls();
      updateSelectedMeta();
    });

    elements.resetScene.addEventListener('click', () => {
      resetAllTransforms(state);
      renderTransformControls();
      updateSelectedMeta();
    });
  }

  function renderPartList() {
    elements.partList.innerHTML = '';
    state.parts.forEach((part) => {
      const btn = document.createElement('button');
      btn.className = 'part-btn';
      if (state.selectedPart?.id === part.id) btn.classList.add('active');
      btn.innerHTML = `<strong>${part.label}</strong><span>${part.description}</span>`;
      btn.addEventListener('click', () => selectPart(part.id));
      elements.partList.appendChild(btn);
    });
  }

  function highlightSelectedMesh() {
    state.parts.forEach((part) => {
      part.mesh.renderOutline = state.selectedPart?.id === part.id;
      part.mesh.outlineWidth = 0.08;
      part.mesh.outlineColor = BABYLON.Color3.FromHexString('#38bdf8');
    });
  }

  function renderTransformControls() {
    elements.positionControls.innerHTML = '';
    elements.scaleControls.innerHTML = '';
    if (!state.selectedPart) return;

    const mesh = state.selectedPart.mesh;
    createRangeControl(elements.positionControls, 'Pos X', -4, 4, 0.01, () => mesh.position.x, (v) => { mesh.position.x = v; updateSelectedMeta(); });
    createRangeControl(elements.positionControls, 'Pos Y', 0, 4, 0.01, () => mesh.position.y, (v) => { mesh.position.y = v; updateSelectedMeta(); });
    createRangeControl(elements.positionControls, 'Pos Z', -4, 4, 0.01, () => mesh.position.z, (v) => { mesh.position.z = v; updateSelectedMeta(); });
    createRangeControl(elements.scaleControls, 'Scale X', 0.3, 3, 0.01, () => mesh.scaling.x, (v) => { mesh.scaling.x = v; updateSelectedMeta(); });
    createRangeControl(elements.scaleControls, 'Scale Y', 0.3, 3, 0.01, () => mesh.scaling.y, (v) => { mesh.scaling.y = v; updateSelectedMeta(); });
    createRangeControl(elements.scaleControls, 'Scale Z', 0.3, 3, 0.01, () => mesh.scaling.z, (v) => { mesh.scaling.z = v; updateSelectedMeta(); });
  }

  function updateSelectedMeta() {
    if (!state.selectedPart) {
      elements.selectedMeta.textContent = 'Nothing selected yet.';
      return;
    }
    const mesh = state.selectedPart.mesh;
    elements.selectedMeta.textContent = `${state.selectedPart.label} | pos (${format(mesh.position.x)}, ${format(mesh.position.y)}, ${format(mesh.position.z)}) | scale (${format(mesh.scaling.x)}, ${format(mesh.scaling.y)}, ${format(mesh.scaling.z)})`;
  }

  return { selectPart, bindResetActions };
}

function createRangeControl(container, label, min, max, step, getValue, setValue) {
  const wrap = document.createElement('div');
  wrap.className = 'control-group';
  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  const valueEl = document.createElement('div');
  valueEl.className = 'value-box';

  function sync() {
    const value = getValue();
    input.value = String(value);
    valueEl.textContent = format(value);
  }

  input.addEventListener('input', () => {
    const value = Number(input.value);
    setValue(value);
    valueEl.textContent = format(value);
  });

  wrap.append(labelEl, input, valueEl);
  container.appendChild(wrap);
  sync();
}

function format(value) {
  return Number(value).toFixed(2);
}
