import React, {useState} from "react";
import {ObjectConfig} from "../models/ObjectConfig";
import PlaneLoader from "./PlaneLoader";
import CubeLoader from "./CubeLoader";
import ExtrudedCube from "./ExtrudedCube";
import NPoint from "./NPoint";
import CylinderLoader from "./CylinderLoader";
import LatheLoader from "./LatheLoader";

const ObjectLoader = (config: ObjectConfig, index: number) => {
    switch (config.type) {
        case "Plane":
            return <PlaneLoader key={index} {...config}/>;
        case "Cube":
            return <CubeLoader key={index} {...config}/>;
        case "Cylinder":
            return <CylinderLoader key={index} {...config}/>;
        case "Extruded":
            return <ExtrudedCube key={index} {...config}/>;
        case "Lathe":
            return <LatheLoader key={index} {...config}></LatheLoader>
        case "NPoint":
            return <NPoint key={index} {...config}/>;
    }
}
export default ObjectLoader;
