import {ColorConfig} from "./ColorConfig";

export interface MaterialConfig {
    color: ColorConfig;
    wireframe: boolean;
    reflectivity: number;
    roughness?: number;
}
