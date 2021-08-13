import {ColorConfig} from "./ColorConfig";

export interface MaterialConfig {
    color: string;
    wireframe: boolean;
    reflectivity: number;
    roughness?: number;
}
