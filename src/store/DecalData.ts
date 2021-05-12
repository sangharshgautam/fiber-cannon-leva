import {ObjectGeometry, ObjectMaterial, ObjectTransform} from "./ObjectStore";

export default interface DecalData {
    uuid: string;
    transform: ObjectTransform;
    // geometry: ObjectGeometry,
    material: ObjectMaterial,
}
