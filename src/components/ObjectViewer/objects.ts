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
  // Degrees passed to EdgesGeometry for the wireframe overlay — higher
  // keeps fewer, sharper edges (only angles above the threshold render).
  // Defaults to 65 when omitted; denser models can raise this to cut
  // internal line clutter without affecting the rest of the catalog.
  edgeAngle?: number;
}

// OBJECT_VIEWER's catalog — add an entry here (model file + metadata the
// HUD reads directly) to make it browsable via the viewer's prev/next
// arrows. Order here is display order.
export const OBJECTS: ViewerObject[] = [
  {
    id: "OBJECT_001",
    name: "STARSHIP",
    category: "SPACE VEHICLE",
    status: "ARCHIVED",
    modelUrl: "/models/nave.obj",
    targetSize: 2.6,
  },
  {
    id: "OBJECT_002",
    name: "FLOPPY_DISK",
    category: "DATA STORAGE",
    status: "ARCHIVED",
    modelUrl: "/models/floppy.obj",
    targetSize: 2.3,
    standRotationX: Math.PI / 2,
  },
  {
    id: "OBJECT_003",
    name: "TERMINAL",
    category: "COMPUTING UNIT",
    status: "ARCHIVED",
    modelUrl: "/models/pcscify1.obj",
    targetSize: 1.8,
    edgeAngle: 160,
  },
];
