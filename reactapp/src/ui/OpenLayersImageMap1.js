import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Style, Icon, Circle, Fill, Stroke } from "ol/style";

// Import images from assets
import doorBlue from "../Image/door-blue.png"; // Ensure correct path
import floorImage from '../Image/floor.png'; // Ensure correct path

const OpenLayersImageMap1 = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        // Define the extent of the floor image (adjust based on your image dimensions)
        const imageExtent = [0, 0, 1024, 768]; // Example: 1024x768 pixels

        // Center of the image
        const center = [
            (imageExtent[0] + imageExtent[2]) / 2, // Center X
            (imageExtent[1] + imageExtent[3]) / 2, // Center Y
        ];

        // Create an image layer using the floor image
        const imageLayer = new ImageLayer({
            source: new Static({
                url: floorImage, // Use the imported floor image
                imageExtent: imageExtent,
                projection: 'EPSG:3857', // Use Web Mercator projection
            }),
        });

        // Icon feature
        const featureIcon = new Feature({
            geometry: new Point([imageExtent[2] * 0.75, imageExtent[3] * 0.75]), // Place icon at 75% of image width and height
        });

        // Icon style
        const iconStyle = new Style({
            image: new Icon({
                src: doorBlue,
                scale: 0.1, // Adjust scale as needed
            }),
        });

        // Circle feature
        const featurePoint = new Feature({
            geometry: new Point([imageExtent[2] * 0.5, imageExtent[3] * 0.5]), // Place point at center
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

        // Create a vector layer and add the features to it
        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [featureIcon, featurePoint],
            }),
        });

        // Create the map
        const map = new Map({
            target: mapRef.current,
            layers: [imageLayer, vectorLayer], // Use the floor image layer and vector layer
            view: new View({
                projection: 'EPSG:3857', // Use Web Mercator projection
                center: center,
                zoom: 1, // Adjust zoom level as needed
            }),
        });

        // Cleanup on unmount
        return () => map.setTarget(undefined);
    }, []);

    return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default OpenLayersImageMap1;