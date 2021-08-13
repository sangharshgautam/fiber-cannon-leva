import {BlockConfig} from "./BlockConfig";
import {TransformConfig} from "./TransformConfig";
import {PhysicsConfig} from "./PhysicsConfig";

export interface GroupConfig {
    name: string;
    castShadow: boolean;
    receiveShadow: boolean;
    transform: TransformConfig;
    objects: BlockConfig[];
    physics: PhysicsConfig;
    disabled: boolean;
}
