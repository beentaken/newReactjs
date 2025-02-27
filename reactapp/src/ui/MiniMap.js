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

const miniMap = () => {
    const mapRef = useRef(null);
    const vectorLayerRef = useRef(null);
    const featureIconRef = useRef(null);
    const featurePointRef = useRef(null);

    const [map, setMap] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState("redDot");

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

        // Create the door icon feature
        const featureIcon = new Feature({
            geometry: new Point([imageExtent[2] * 0.75, imageExtent[3] * 0.75]),
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
            geometry: new Point([imageExtent[2] * 0.5, imageExtent[3] * 0.5]),
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

        // Create a vector layer and add both features
        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [featureIcon, featurePoint],
            }),
        });

        vectorLayerRef.current = vectorLayer;

        const newMap = new Map({
            target: mapRef.current,
            layers: [imageLayer, vectorLayer],
            view: new View({
                center: center,
                zoom: 1,
                extent: imageExtent,
            }),
        });

        setMap(newMap);

        return () => {
            if (newMap) {
                newMap.setTarget(null);
            }
        };
    }, []);

    // ✅ Function to remove selected feature
    const removeFeature = () => {
        if (vectorLayerRef.current) {
            const source = vectorLayerRef.current.getSource();
            if (selectedFeature === "redDot" && featurePointRef.current) {
                source.removeFeature(featurePointRef.current);
            } else if (selectedFeature === "doorIcon" && featureIconRef.current) {
                source.removeFeature(featureIconRef.current);
            }
        }
    };

    return (
        <div>
            {/* Material-UI Controls */}
            <Box sx={{  zIndex: 1000, display: "flex", gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Select Feature</InputLabel>
                    <Select
                        value={selectedFeature}
                        onChange={(e) => setSelectedFeature(e.target.value)}
                        label="Select Feature"
                    >
                        <MenuItem value="redDot">Red Dot</MenuItem>
                        <MenuItem value="doorIcon">Door Icon</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="error" onClick={removeFeature}>
                    Remove
                </Button>
            </Box>

            {/* Map Container */}
            <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
        </div>
    );
};

export default miniMap;
