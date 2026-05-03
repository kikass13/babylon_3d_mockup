export function createEditorState() {
  return { parts: [], selectedPart: null, originals: new Map() };
}

export function saveOriginalTransform(state, part) {
  state.originals.set(part.id, {
    position: part.mesh.position.clone(),
    scaling: part.mesh.scaling.clone(),
  });
}

export function resetPartTransform(state, part) {
  const original = state.originals.get(part.id);
  if (!original) return;
  part.mesh.position.copyFrom(original.position);
  part.mesh.scaling.copyFrom(original.scaling);
}

export function resetAllTransforms(state) {
  state.parts.forEach((part) => resetPartTransform(state, part));
}
