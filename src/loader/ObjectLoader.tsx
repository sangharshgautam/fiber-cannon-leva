import {useLoader, useThree} from "@react-three/fiber";
import {TextureLoader} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import React, {useState} from "react";
import {ObjectConfig} from "../models/ObjectConfig";
import Plane from "../shapes/Plane";
import Cube from "../shapes/Cube";
import Extruded from "../shapes/Extruded";
import NPoint from "../shapes/NPoint";

const ObjectLoader = (config: ObjectConfig, index: number) => {
    switch (config.type) {
        case "Plane":
            return <Plane key={index} {...config}/>;
        case "Cube":
            return <Cube key={index} {...config}/>;
        case "Extruded":
            return <Extruded key={index} {...config}/>;
        case "NPoint":
            return <NPoint key={index} {...config}/>;
    }
}
export default ObjectLoader;
