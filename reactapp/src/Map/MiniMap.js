import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Style, Icon, Circle, Fill, Stroke } from "ol/style";
import Translate from "ol/interaction/Translate";

// Material-UI
import { FormControl, InputLabel, MenuItem, Select, Button, Box, Paper, Typography } from "@mui/material";

// Images
import doorBlue from "../Images/door-blue.png";
import doorRed from "../Images/door-red.png";
import floorImage from "../Images/floor.png";

const MiniMap = () => {
    const featureOptions = ['redDot', 'doorIcon', 'removeAll'];
    const mapRef = useRef(null);
    const vectorLayerRef = useRef(null);
    const featureIconRef = useRef(null);
    const featurePointRef = useRef(null);
    const popupRef = useRef(null);

    const [map, setMap] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState("redDot");
    const [vectorSource, setVectorSource] = useState(null);
    const [removedFeatures, setRemovedFeatures] = useState([]);
    const [popupContent, setPopupContent] = useState("");

    const fetchRandomCoordinates = async () => {
        try {
            const response = await fetch('http://localhost:7048/api/minimap/GetCoordinates'); // Adjust port if needed
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch coordinates:", error);
            return null;
        }
    };

    const fetchRandomCoordinate = async (id) => {
        try {
            const response = await fetch(`http://localhost:7048/api/minimap/GetCoordinate/${id}`); // Include the id
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Failed to fetch coordinates:", error);
            return null;
        }
    };


    useEffect(() => {
        const fetchDatas = async () => {
            const coordinates = await fetchRandomCoordinates();
            if (coordinates) {
                console.log("Fetched Coordinates:", coordinates);

            }
        };

        fetchDatas(); // Call the async function


        const fetchData = async () => {
            const coordinate = await fetchRandomCoordinate(1); // Pass an id (e.g., 1)
            if (coordinate) {
                console.log("Fetched Coordinate:", coordinate);
            }
        };

        fetchData(); // Call the async function

        if (!mapRef.current) return;

        const imageExtent = [0, 0, 800, 600];
        const center = [(imageExtent[0] + imageExtent[2]) / 2, (imageExtent[1] + imageExtent[3]) / 2];

        const imageLayer = new ImageLayer({
            source: new Static({
                url: floorImage,
                imageExtent: imageExtent,
                imageLoadFunction: (image, src) => {
                    image.getImage().src = src;
                    image.getImage().onerror = () => {
                        console.error("Failed to load image:", src);
                    };
                },
            }),
        });

        const featureIcon = new Feature({
            geometry: new Point([imageExtent[2] * 0.75, imageExtent[3] * 0.75]),
            name: "Door Icon",
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

        const featurePoint = new Feature({
            geometry: new Point([imageExtent[2] * 0.5, imageExtent[3] * 0.5]),
            name: "Red Dot",
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

        const vectorSrc = new VectorSource({
            features: [featureIcon, featurePoint],
        });

        setVectorSource(vectorSrc);

        const vectorLayer = new VectorLayer({ source: vectorSrc });
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

        const translateInteraction = new Translate({ layers: [vectorLayer] });
        newMap.addInteraction(translateInteraction);

        const popupOverlay = new Overlay({
            element: popupRef.current,
            positioning: "bottom-center",
            autoPan: true,
            autoPanAnimation: { duration: 250 },
        });
        newMap.addOverlay(popupOverlay);

        newMap.on("click", (event) => {
            const feature = newMap?.forEachFeatureAtPixel(event.pixel, (feat) => feat);
            if (feature) {
                setPopupContent(feature.get("name"));
                popupOverlay.setPosition(event.coordinate);
                popupRef.current.style.display = "block";

                setTimeout(() => {
                    popupRef.current.style.display = "none";
                }, 3000);
            } else {
                popupRef.current.style.display = "none";
            }
        });

        setMap(newMap);

        return () => {
            if (newMap) newMap.setTarget(null);
        };
    }, []);

    const removeFeature = () => {
        if (vectorLayerRef.current && vectorSource) {
            const source = vectorLayerRef.current.getSource();
            if (selectedFeature === "redDot" && featurePointRef.current) {
                setRemovedFeatures([...removedFeatures, featurePointRef.current]);
                source.removeFeature(featurePointRef.current);
            } else if (selectedFeature === "doorIcon" && featureIconRef.current) {
                setRemovedFeatures([...removedFeatures, featureIconRef.current]);
                source.removeFeature(featureIconRef.current);
            } else if (selectedFeature === "removeAll") {
                const features = source.getFeatures();
                setRemovedFeatures([...removedFeatures, ...features]);
                source.clear();
            }
        }
    };

    const restoreAllFeatures = () => {
        if (vectorSource && removedFeatures.length > 0) {
            vectorSource.addFeatures(removedFeatures);
            setRemovedFeatures([]);
        }
    };

    return (
        <div>
            <Box sx={{ zIndex: 1000, display: "flex", gap: 2, padding: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Select Feature</InputLabel>
                    <Select value={selectedFeature} onChange={(e) => setSelectedFeature(e.target.value)}>
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
            <div ref={mapRef} style={{ width: "100%", height: "calc(100vh - 64px)" }} />

            <div ref={popupRef} style={{ display: "none", position: "absolute", zIndex: 1000 }}>
                <Paper elevation={3} sx={{ padding: 2, bgcolor: "white" }}>
                    <Typography variant="body1">{popupContent}</Typography>
                </Paper>
            </div>
        </div>
    );
};

export default MiniMap;