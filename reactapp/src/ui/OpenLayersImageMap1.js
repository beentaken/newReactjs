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

// Import images from assets (ensure correct paths)
import doorBlue from "../Image/door-blue.png";
import floorImage from "../Image/floor.png";

const OpenLayersImageMap1 = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return; // ✅ Prevent running if ref is not set

        // ✅ Define the extent manually (use your image's real dimensions)
        const imageExtent = [0, 0, 800, 600]; // Example: 800x600 pixels

        // ✅ Use the predefined extent (do NOT call getExtent())
        const extent = imageExtent;

        // Center of the image
        const center = [
            (extent[0] + extent[2]) / 2, // Center X
            (extent[1] + extent[3]) / 2, // Center Y
        ];

        // ✅ Initialize image layer correctly
        const imageLayer = new ImageLayer({
            source: new Static({
                url: floorImage,
                imageExtent: extent, // ✅ Use manually defined extent
            }),
        });

        // Icon feature (door)
        const featureIcon = new Feature({
            geometry: new Point([extent[2] * 0.75, extent[3] * 0.75]), // 75% of width/height
        });

        const iconStyle = new Style({
            image: new Icon({
                src: doorBlue,
                scale: 0.1,
                anchor: [0.5, 1],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
            }),
        });

        // Circle feature (red dot)
        const featurePoint = new Feature({
            geometry: new Point([extent[2] * 0.5, extent[3] * 0.5]), // Center of image
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

        // Create a vector layer and add the features
        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [featureIcon, featurePoint],
            }),
        });

        // ✅ Ensure the map initializes properly
        const map = new Map({
            target: mapRef.current,
            layers: [imageLayer, vectorLayer],
            view: new View({
                center: center,
                zoom: 1,
                extent: extent, // ✅ Use manually defined extent
            }),
        });

        // Cleanup function to prevent memory leaks
        return () => {
            if (map) {
                map.setTarget(null);
            }
        };
    }, []);

    return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default OpenLayersImageMap1;
