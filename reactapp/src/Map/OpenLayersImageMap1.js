import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol";
import { Style, Icon, Circle, Fill, Stroke } from "ol/style";

// Import images (ensure correct paths)
import doorBlue from "../Images/door-blue.png";
import floorImage from "../Images/floor.png";

const OpenLayersImageMap1 = () => {
    const mapRef = useRef(null);
    const vectorLayerRef = useRef(null);
    const featurePointRef = useRef(null); // Store the red dot feature

    const [map, setMap] = useState(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const imageExtent = [0, 0, 800, 600]; // Image extent
        const center = [
            (imageExtent[0] + imageExtent[2]) / 2,
            (imageExtent[1] + imageExtent[3]) / 2,
        ];

        const imageLayer = new ImageLayer({
            source: new Static({
                url: floorImage,
                imageExtent: imageExtent,
            }),
        });

        // Create a door icon feature
        const featureIcon = new Feature({
            geometry: new Point([imageExtent[2] * 0.75, imageExtent[3] * 0.75]),
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

        featureIcon.setStyle(iconStyle);

        // Create a red dot feature (store reference for removal)
        const featurePoint = new Feature({
            geometry: new Point([imageExtent[2] * 0.5, imageExtent[3] * 0.5]),
        });

        featurePointRef.current = featurePoint; // Store feature for later removal

        const pointStyle = new Style({
            image: new Circle({
                radius: 6,
                fill: new Fill({ color: "red" }),
                stroke: new Stroke({ color: "white", width: 2 }),
            }),
        });

        featurePoint.setStyle(pointStyle);

        // Create a vector layer and add both features
        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [featureIcon, featurePoint],
            }),
        });

        vectorLayerRef.current = vectorLayer; // Store vector layer for removal

        const newMap = new Map({
            target: mapRef.current,
            layers: [imageLayer, vectorLayer],
            view: new View({
                center: center,
                zoom: 1,
                extent: imageExtent,
            }),
        });

        setMap(newMap); // Store map instance

        return () => {
            if (newMap) {
                newMap.setTarget(null);
            }
        };
    }, []);

    // ✅ Function to remove the red dot feature
    const removeFeature = () => {
        if (vectorLayerRef.current && featurePointRef.current) {
            const source = vectorLayerRef.current.getSource();
            source.removeFeature(featurePointRef.current); // Remove red dot
        }
    };

    return (
        <div>
            <button onClick={removeFeature} style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
                Remove Red Dot
            </button>
            <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
        </div>
    );
};

export default OpenLayersImageMap1;
