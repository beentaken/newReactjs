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

// Material-UI imports
import { FormControl, InputLabel, MenuItem, Select, Button, Box } from "@mui/material";

// Import images (ensure correct paths)
import doorBlue from "../Image/door-blue.png";
import floorImage from "../Image/floor.png";

const MiniMap = () => {
    const featureOptions = [
        'redDot', // Red dot
        'doorIcon', // Door icon
        'removeAll', // Remove all features
    ];

    const mapRef = useRef(null);
    const vectorLayerRef = useRef(null);
    const featureIconRef = useRef(null);
    const featurePointRef = useRef(null);

    const [map, setMap] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState("redDot");
    const [vectorSource, setVectorSource] = useState(null);
    const [removedFeatures, setRemovedFeatures] = useState([]);

    useEffect(() => {
        if (!mapRef.current) return;

        const imageExtent = [0, 0, 800, 600]; // Image extent (adjust based on your image dimensions)
        const center = [
            (imageExtent[0] + imageExtent[2]) / 2, // Center X
            (imageExtent[1] + imageExtent[3]) / 2, // Center Y
        ];

        // Create the image layer for the floor image
        const imageLayer = new ImageLayer({
            source: new Static({
                url: floorImage,
                imageExtent: imageExtent,
            }),
        });

        // Create the door icon feature
        const featureIcon = new Feature({
            geometry: new Point([imageExtent[2] * 0.75, imageExtent[3] * 0.75]), // Position at 75% of image width and height
        });

        featureIconRef.current = featureIcon;

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

        // Create the red dot feature
        const featurePoint = new Feature({
            geometry: new Point([imageExtent[2] * 0.5, imageExtent[3] * 0.5]), // Position at center
        });

        featurePointRef.current = featurePoint;

        const pointStyle = new Style({
            image: new Circle({
                radius: 6,
                fill: new Fill({ color: "red" }),
                stroke: new Stroke({ color: "white", width: 2 }),
            }),
        });

        featurePoint.setStyle(pointStyle);

        // Create a vector source and add both features
        const vectorSrc = new VectorSource({
            features: [featureIcon, featurePoint],
        });

        setVectorSource(vectorSrc);

        // Create a vector layer and add the vector source
        const vectorLayer = new VectorLayer({
            source: vectorSrc,
        });

        vectorLayerRef.current = vectorLayer;

        // Create the map
        const newMap = new Map({
            target: mapRef.current,
            layers: [imageLayer, vectorLayer], // Add the image layer and vector layer
            view: new View({
                center: center,
                zoom: 1,
                extent: imageExtent,
            }),
        });

        setMap(newMap);

        // Cleanup on unmount
        return () => {
            if (newMap) {
                newMap.setTarget(null);
            }
        };
    }, []);

    // Function to remove selected feature
    const removeFeature = () => {
        if (vectorLayerRef.current) {
            const source = vectorLayerRef.current.getSource();

            if (selectedFeature === "redDot" && featurePointRef.current) {
                setRemovedFeatures([...removedFeatures, featurePointRef.current]); // Add to removed features
                source.removeFeature(featurePointRef.current); // Remove the red dot
            } else if (selectedFeature === "doorIcon" && featureIconRef.current) {
                setRemovedFeatures([...removedFeatures, featureIconRef.current]); // Add to removed features
                source.removeFeature(featureIconRef.current); // Remove the door icon
            } else if (selectedFeature === "removeAll") {
                const features = source.getFeatures(); // Get all features
                setRemovedFeatures([...removedFeatures, ...features]); // Add all features to removed features
                source.clear(); // Remove all features
            }
        }
    };

    // Function to restore all removed features
    const restoreAllFeatures = () => {
        if (vectorSource && removedFeatures.length > 0) {
            vectorSource.addFeatures(removedFeatures); // Restore all removed features
            setRemovedFeatures([]); // Clear the removed features list
        }
    };

    return (
        <div>
            {/* Material-UI Controls */}
            <Box sx={{ zIndex: 1000, display: "flex", gap: 2, padding: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Select Feature</InputLabel>
                    <Select
                        value={selectedFeature}
                        onChange={(e) => setSelectedFeature(e.target.value)}
                        label="Select Feature"
                    >
                        {featureOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="error" onClick={removeFeature}>
                    Remove
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={restoreAllFeatures}
                    disabled={removedFeatures.length === 0}
                >
                    Restore All Features
                </Button>
            </Box>

            {/* Map Container */}
            <div ref={mapRef} style={{ width: "100%", height: "calc(100vh - 64px)" }} />
        </div>
    );
};

export default MiniMap;