export interface ViewerObject {
  id: string;
  name: string;
  category: string;
  status: string;
  modelUrl: string;
  targetSize: number;
  // Radians applied to the model on load, before it's handed to the
  // continuous Y-axis spin — each object is authored in its own resting
  // orientation, so this is how a given model gets stood up/faced forward.
  standRotationX?: number;
}

// OBJECT_VIEWER's catalog — swap CURRENT_OBJECT (or pass a `object` prop to
// <ObjectViewer />) to display a different archived artifact. Each entry is
// self-contained: model file + display metadata the HUD reads directly.
export const CURRENT_OBJECT: ViewerObject = {
  id: "OBJECT_001",
  name: "STARSHIP",
  category: "SPACE VEHICLE",
  status: "ARCHIVED",
  modelUrl: "/models/nave.obj",
  targetSize: 2.6,
};
