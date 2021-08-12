import {TransformConfig} from "../models/TransformConfig";
import {MaterialConfig} from "../models/MaterialConfig";

export default interface DecalConfig {
    uuid: string;
    transform: TransformConfig;
    // geometry: ObjectGeometry,
    material: MaterialConfig,
}
