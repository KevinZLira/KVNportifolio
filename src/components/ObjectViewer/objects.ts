export interface ViewerObject {
  id: string;
  name: string;
  category: string;
  status: string;
  rotationMode: string;
  modelUrl: string;
  targetSize: number;
  sectorLabel: string;
  unitLabel: string;
}

// OBJECT_VIEWER's catalog — swap CURRENT_OBJECT (or pass a `object` prop to
// <ObjectViewer />) to display a different archived artifact. Each entry is
// self-contained: model file + display metadata the HUD reads directly.
export const CURRENT_OBJECT: ViewerObject = {
  id: "OBJECT_001",
  name: "FLOPPY_DISK",
  category: "DATA STORAGE",
  status: "ARCHIVED",
  rotationMode: "MANUAL",
  modelUrl: "/models/floppy.obj",
  targetSize: 2.3,
  sectorLabel: "DATA_SECTOR",
  unitLabel: "STORAGE_UNIT",
};
