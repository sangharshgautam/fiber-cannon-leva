import {Html} from "@react-three/drei";
import React from "react";

// @ts-ignore
const MyLabel = ({mass,hovered, ...props }) => {
return(
    <Html scale={10} style={{ pointerEvents: "none", display: hovered ? "block" : "none" }}>
        <div className="content">
            Mass <br />
            {mass}
        </div>
    </Html>
    )
}
export default MyLabel;
