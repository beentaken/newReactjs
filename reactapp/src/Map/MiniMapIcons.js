import { Feature, Map, Overlay, View } from "ol";
import { Point } from "ol/geom";
import Translate from "ol/interaction/Translate";
import ImageLayer from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import Static from "ol/source/ImageStatic";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Icon, Stroke, Style } from "ol/style";
import React, { useEffect, useRef, useState } from "react";

// Material-UI
import {
    Box, Button, FormControl, InputLabel,TextField,
    MenuItem, Paper, Select, Typography
} from "@mui/material";

// Images
import doorBlue from "../Images/door-blue.png";
import doorRed from "../Images/door-red.png";
import floorImage from "../Images/floor.png";

const MiniMapIcons = () => {
    const featureOptions = ['redDot', 'doorIcon', 'removeAll'];
    const mapRef = useRef(null);
    const locationLayer = useRef(null);
    const featureIconRef = useRef(null);
    const featurePointRef = useRef(null);
    const popupRef = useRef(null);

    const [map, setMap] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState("redDot");
    const [vectorSource, setVectorSource] = useState(null);
    const [removedFeatures, setRemovedFeatures] = useState([]);
    const [popupContent, setPopupContent] = useState("");
    const [doorColor, setDoorColor] = useState("blue");
    const [dragCoord, setDragCoord] = useState(null);
    const [coordx, setCoordX] = useState("");
    const [coordy, setCoordY] = useState("");

    const WordfeatureIcon = new Feature({
        geometry: new Point([coordx, setCoordY]),

        label: "Door Icons", // example custom property
    });



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
        if (featureIconRef.current) {
            const iconUrl = doorColor === "red" ? doorRed : doorBlue;
            featureIconRef.current.setStyle(
                new Style({
                    image: new Icon({
                        src: iconUrl,
                        scale: 0.1,
                        anchor: [0.5, 1],
                        anchorXUnits: "fraction",
                        anchorYUnits: "fraction",
                    }),
                })
            );
        }
    }, [doorColor]);

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

        const vectorSource = new VectorSource({
            features: [featureIcon, featurePoint],
        });

        setVectorSource(vectorSource);

        const featuresLayer = new VectorLayer({ source: vectorSource });
        locationLayer.current = featuresLayer;

        const newMap = new Map({
            target: mapRef.current,
            layers: [imageLayer, featuresLayer],
            view: new View({
                center: center,
                zoom: 1,
                extent: imageExtent,
            }),
        });

        const translateInteraction = new Translate({ layers: [featuresLayer] });
        newMap.addInteraction(translateInteraction);
        translateInteraction.on('translating', (event) => {
            setDragCoord(event.coordinate);
        });
        const popupOverlay = new Overlay({
            element: popupRef.current,
            positioning: "bottom-center",
            autoPan: true,
            autoPanAnimation: { duration: 250 },
        });
        newMap.addOverlay(popupOverlay);

        newMap.on("click", (event) => {
            const feature = newMap.forEachFeatureAtPixel(event.pixel, (feat) => feat);
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
        if (locationLayer.current && vectorSource) {
            const source = locationLayer.current.getSource();
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

    const AddWordFeatures = () => {
        vectorSource.addFeature(WordfeatureIcon);
        var sWordfeatureIcon = WordfeatureIcon;

        vectorSource.addFeature(sWordfeatureIcon);
    };

    const AddFeatures = () => {
        // Log existing features
        vectorSource.getFeatures().forEach((feature, index) => {
            console.log(`Before - Feature ${index}:`);
            console.log('  ID:', feature.getId());
            console.log('  Geometry:', feature.getGeometry());
            console.log('  Properties:', feature.getProperties());
        });

        // Create a new feature
        const featureIcon = new Feature({
            geometry: new Point([10, 100]),
            ID: 1,
            label: "Door Icons", // example custom property
        });

        // Optional: set a feature ID
  //      featureIcon.setId('door-1');

        // Add feature to the vector source
        vectorSource.addFeature(featureIcon);


        const featureIcon2 = new Feature({
            geometry: new Point([10, 100]),
            ID: 1,
            label: "Door Icons", // example custom property
        });

        // Optional: set a feature ID
        //      featureIcon.setId('door-1');

        // Add feature to the vector source
        vectorSource.addFeature(featureIcon2);
        vectorSource.addFeature(WordfeatureIcon);
        

        // Log features again
        vectorSource.getFeatures().forEach((feature, index) => {
            console.log(`After - Feature ${index}:`);
            console.log('  ID:', feature.getId());
            console.log('  Geometry:', feature.getGeometry());
            console.log('  Properties:', feature.getProperties());
        });
    };

    return (
        <div>
            <Box sx={{ zIndex: 1000, display: "flex", gap: 2, padding: 2 }}>
                    <TextField
                        label="Enter something"
                        variant="outlined"
                    value={setCoordX}
                    onChange={(e) => setCoordX(e.target.value)}
                    />
                <div>You typed: {coordx}</div>
                    <TextField
                        label="Enter something"
                        variant="outlined"
                    value={setCoordY}
                    onChange={(e) => setCoordY(e.target.value)}
                    />
                <div>You typed: {coordy}</div>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={AddFeatures}

                >
                    Add Features
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={AddWordFeatures}

                >
                    Add Word Features
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setDoorColor((prev) => (prev === "blue" ? "red" : "blue"))}
                >
                    Toggle Door Color
                </Button>
                <img src="http://localhost:7048/Image/get-randomicons" alt="My Image" />
                {JSON.stringify(dragCoord)}
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

export default MiniMapIcons;