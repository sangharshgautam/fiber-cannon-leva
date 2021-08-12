import {CameraConfig} from "./CameraConfig";
import {LightConfig} from "./LightConfig";
import {WebGlConfig} from "./WebGlConfig";
import {ObjectConfig} from "./ObjectConfig";
import {CanvasConfig} from "./CanvasConfig";
import {ModelConfig} from "./ModelConfig";

export interface SceneConfig {
    canvas: CanvasConfig;
    gl: WebGlConfig;
    camera: CameraConfig;
    lights: LightConfig[];
    objects: ObjectConfig[];
    models: ModelConfig[];
}
