import {ObjectConfig} from "./ObjectConfig";
import {TransformConfig} from "./TransformConfig";

export interface GroupConfig extends TransformConfig {
    name: string;
    castShadow: boolean;
    objects: ObjectConfig[];
}
