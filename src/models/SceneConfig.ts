import {CameraConfig} from "./CameraConfig";
import {LightConfig} from "./LightConfig";
import {WebGlConfig} from "./WebGlConfig";
import {BlockConfig} from "./BlockConfig";
import {CanvasConfig} from "./CanvasConfig";
import {ModelConfig} from "./ModelConfig";
import {GroupConfig} from "./GroupConfig";

export interface SceneConfig {
    canvas: CanvasConfig;
    gl: WebGlConfig;
    camera: CameraConfig;
    lights: LightConfig[];
    objects: BlockConfig[];
    models: ModelConfig[];
    groups: GroupConfig[];
}
