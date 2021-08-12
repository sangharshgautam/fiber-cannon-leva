import {TransformConfig} from "./TransformConfig";
import {GeometryConfig} from "./GeometryConfig";
import {MaterialConfig} from "./MaterialConfig";
import {PhysicsConfig} from "./PhysicsConfig";
import DecalConfig from "./DecalConfig";
import {State} from "zustand";

export interface ObjectConfig extends State {
    uuid: string;
    name: string;
    type: 'Plane'| 'Cube' | 'NPoint' | 'Cylinder' | 'Extruded' | 'Lathe';
    castShadow: boolean;
    transform: TransformConfig;
    geometry: GeometryConfig;
    material: MaterialConfig;
    physics: PhysicsConfig;
    decals: DecalConfig[];
}
