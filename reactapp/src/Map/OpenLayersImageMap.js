import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Style, Icon, Circle, Fill, Stroke } from "ol/style";

// Import image from assets (if in src/assets/)
import doorBlue from "../Images/door-blue.png"; // Ensure correct path

const OpenLayersImageMap = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        const center = fromLonLat([0, 0]);

        // Icon feature
        const featureIcon = new Feature({
            geometry: new Point(fromLonLat([0, 0])), // Corrected longitude
        });

        // Corrected image path
        const iconStyle = new Style({
            image: new Icon({
                src: doorBlue, // Path to your image
                scale: 0.1, // Adjust scale as needed
                anchor: [0.5, 1],
            }),
        });

        // Circle feature
        const featurePoint = new Feature({
            geometry: new Point(fromLonLat([5, 5])),
        });

        const pointStyle = new Style({
            image: new Circle({
                radius: 6,
                fill: new Fill({ color: "red" }),
                stroke: new Stroke({ color: "white", width: 2 }),
            }),
        });

        featureIcon.setStyle(iconStyle);
        featurePoint.setStyle(pointStyle);

        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [featureIcon, featurePoint],
            }),
        });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer,
            ],
            view: new View({
                projection: "EPSG:3857",
                center: center,
                zoom: 2,
            }),
        });

        return () => map.setTarget(undefined);
    }, []);

    return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default OpenLayersImageMap;
