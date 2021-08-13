import {TransformConfig} from "./TransformConfig";
import {GeometryConfig} from "./GeometryConfig";
import {MaterialConfig} from "./MaterialConfig";
import {PhysicsConfig} from "./PhysicsConfig";
import DecalConfig from "./DecalConfig";
import {State} from "zustand";

export interface BlockConfig extends TransformConfig {
    uuid: string;
    name: string;
    type: 'Box' | 'Circle' | 'Cone' | 'Cylinder' | 'Dodecahedron'| 'Edges' | 'Extruded' | 'Ground' | 'Icosahedron' | 'Lathe' | 'Octahedron' | 'Parametric' | 'Plane'| 'Polyhedron' | 'Ring' | 'Shape' | 'Sphere' | 'Tetrahedron' | 'Text' | 'Torus' | 'TorusKnot' | 'Tube' | 'Wireframe';
    castShadow: boolean;
    transform: TransformConfig;
    geometry: GeometryConfig;
    material: MaterialConfig;
    physics: PhysicsConfig;
    decals: DecalConfig[];
}
