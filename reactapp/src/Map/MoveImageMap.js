import React, { useEffect, useRef, useState, useCallback } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Cluster from "ol/source/Cluster";
import { Feature } from "ol";
import { Style, Icon, Circle, Fill, Stroke, Text } from "ol/style";
import {
    Button,
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert
} from "@mui/material";
import { Modify, Select as OlSelect } from "ol/interaction";
import { pointerMove } from "ol/events/condition";

import doorBlue from "../Images/door-blue.png";

// ================= API =================
const API = "https://localhost:44317";

// ================= FETCH HELPERS =================
const fetchJson = async (url) => {
    const r = await fetch(url);
    if (!r.ok) throw new Error("Request failed");
    return r.json();
};

const fetchBlob = async (url) => {
    const r = await fetch(url);
    if (!r.ok) throw new Error("Request failed");
    return { blob: await r.blob(), headers: r.headers };
};

// ================= CLUSTER STYLE =================
const styleCache = {};

const clusterStyle = (feature) => {
    const size = feature.get("features").length;

    if (!styleCache[size]) {
        if (size === 1) {
            // Single marker - make it larger for better dragging
            styleCache[size] = new Style({
                image: new Icon({
                    src: doorBlue,
                    scale: 0.12, // Slightly larger for better dragging
                    anchor: [0.5, 1],
                    crossOrigin: "anonymous"
                })
            });
        } else {
            // Cluster marker
            styleCache[size] = new Style({
                image: new Circle({
                    radius: 15,
                    fill: new Fill({ color: "#1976d2" }),
                    stroke: new Stroke({ color: "#ffffff", width: 2 })
                }),
                text: new Text({
                    text: size.toString(),
                    fill: new Fill({ color: "#ffffff" }),
                    stroke: new Stroke({ color: "#000000", width: 2 })
                })
            });
        }
    }
    return styleCache[size];
};

// ================= COMPONENT =================
const OpenLayersImageMap = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const vectorSourceRef = useRef(null);
    const modifyInteractionRef = useRef(null);
    const selectInteractionRef = useRef(null);

    const [featureOptions, setFeatureOptions] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState("");

    const [base64File, setBase64File] = useState(null);
    const [blobFile, setBlobFile] = useState(null);
    const [headers, setHeaders] = useState(null);

    const [loading, setLoading] = useState({ base64: false, blob: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [editMode, setEditMode] = useState(false);
    const [movedFeatures, setMovedFeatures] = useState([]); // Track moved features

    // ================= DOWNLOAD HELPERS =================
    const downloadBlob = useCallback((blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    const downloadFromBase64 = useCallback(() => {
        if (!base64File?.base64) return;

        setLoading(l => ({ ...l, base64: true }));

        const bytes = Uint8Array.from(atob(base64File.base64), c => c.charCodeAt(0));
        downloadBlob(new Blob([bytes]), base64File.fileName || "download.bin");

        setLoading(l => ({ ...l, base64: false }));
    }, [base64File, downloadBlob]);

    const fetchFileByName = async () => {
        if (!selectedFeature) return;

        setLoading(l => ({ ...l, blob: true }));

        try {
            const { blob, headers } = await fetchBlob(
                `${API}/Archive/GetArchiveFile?filename=${encodeURIComponent(selectedFeature)}`
            );

            setBlobFile(blob);
            setHeaders(headers);

            let fileName = selectedFeature;
            const cd = headers?.get("Content-Disposition");
            if (cd) {
                const match = cd.match(/filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/);
                if (match) fileName = decodeURIComponent(match[1] || match[2]);
            }

            downloadBlob(blob, fileName);
        } catch (e) {
            console.error(e);
            showSnackbar("Failed to fetch file", "error");
        } finally {
            setLoading(l => ({ ...l, blob: false }));
        }
    };

    // ================= EDIT MODE FUNCTIONS =================
    const toggleEditMode = () => {
        const newEditMode = !editMode;
        setEditMode(newEditMode);

        if (mapInstance.current) {
            if (newEditMode) {
                // Enable modify interaction
                if (!modifyInteractionRef.current) {
                    modifyInteractionRef.current = new Modify({
                        source: vectorSourceRef.current,
                        // Only modify on drag (not on click)
                        condition: pointerMove
                    });
                }

                // Add select interaction to highlight selected features
                if (!selectInteractionRef.current) {
                    selectInteractionRef.current = new OlSelect({
                        style: new Style({
                            image: new Icon({
                                src: doorBlue,
                                scale: 0.15, // Larger when selected
                                anchor: [0.5, 1],
                                crossOrigin: "anonymous"
                            })
                        })
                    });
                }

                mapInstance.current.addInteraction(modifyInteractionRef.current);
                mapInstance.current.addInteraction(selectInteractionRef.current);

                showSnackbar("Edit mode enabled: Drag icons to move them", "info");
            } else {
                // Disable modify interaction
                if (modifyInteractionRef.current) {
                    mapInstance.current.removeInteraction(modifyInteractionRef.current);
                }
                if (selectInteractionRef.current) {
                    mapInstance.current.removeInteraction(selectInteractionRef.current);
                }

                // Show moved features coordinates
                if (movedFeatures.length > 0) {
                    console.log("Moved features:", movedFeatures);
                    showSnackbar(`Moved ${movedFeatures.length} features. Check console for coordinates.`, "success");

                    // Here you could send the updated coordinates to your API
                    // updateCoordinates(movedFeatures);
                }

                showSnackbar("Edit mode disabled", "info");
            }
        }
    };

    // Function to update coordinates on server (optional)
    const updateCoordinates = async (features) => {
        try {
            const updates = features.map(f => ({
                id: f.id, // You'll need to add IDs to your features
                x: toLonLat(f.getGeometry().getCoordinates())[0],
                y: toLonLat(f.getGeometry().getCoordinates())[1]
            }));

            // Uncomment when you have an API endpoint
            // await fetch(`${API}/api/Minimap/UpdateCoordinates`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(updates)
            // });

            showSnackbar("Coordinates updated successfully", "success");
        } catch (error) {
            console.error("Failed to update coordinates:", error);
            showSnackbar("Failed to update coordinates", "error");
        }
    };

    // ================= MAP INIT =================
    useEffect(() => {
        if (mapInstance.current) return;

        (async () => {
            try {
                const [coords, archive64, options] = await Promise.all([
                    fetchJson(`${API}/api/Minimap/GetCoordinates`),
                    fetchJson(`${API}/Archive/GetArchive64`),
                    fetchJson(`${API}/Archive/GetArchiveOptions`)
                ]);

                setBase64File(archive64);
                setFeatureOptions(options);

                // 🔹 Create features
                const features = [];

                // Add sample features with IDs
                features.push(
                    new Feature({
                        geometry: new Point(fromLonLat([0, 0])),
                        id: "feature_0",
                        type: "sample"
                    })
                );

                features.push(
                    new Feature({
                        geometry: new Point(fromLonLat([5, 5])),
                        id: "feature_1",
                        type: "sample"
                    })
                );

                // Add coordinates from API with IDs
                coords?.forEach((c, index) =>
                    features.push(
                        new Feature({
                            geometry: new Point(fromLonLat([c.x, c.y])),
                            status: c.status,
                            id: c.id || `coord_${index}`,
                            type: "coordinate"
                        })
                    )
                );

                const vectorSource = new VectorSource({ features });
                vectorSourceRef.current = vectorSource;

                // Listen for feature changes
                vectorSource.on('changefeature', (event) => {
                    const feature = event.feature;
                    if (feature && editMode) {
                        const newCoords = feature.getGeometry().getCoordinates();
                        const lonLat = toLonLat(newCoords);

                        // Track moved features
                        setMovedFeatures(prev => {
                            const existing = prev.find(f => f.id === feature.get('id'));
                            if (existing) {
                                return prev.map(f =>
                                    f.id === feature.get('id')
                                        ? { ...f, x: lonLat[0], y: lonLat[1] }
                                        : f
                                );
                            } else {
                                return [...prev, {
                                    id: feature.get('id'),
                                    x: lonLat[0],
                                    y: lonLat[1],
                                    type: feature.get('type')
                                }];
                            }
                        });

                        console.log(`Feature ${feature.get('id')} moved to:`, lonLat);
                    }
                });

                const clusterSource = new Cluster({
                    distance: editMode ? 100 : 40, // Larger distance when editing to avoid clustering
                    source: vectorSource
                });

                const clusterLayer = new VectorLayer({
                    source: clusterSource,
                    style: clusterStyle
                });

                mapInstance.current = new Map({
                    target: mapRef.current,
                    layers: [
                        new TileLayer({ source: new OSM(), preload: Infinity }),
                        clusterLayer
                    ],
                    view: new View({
                        center: fromLonLat([0, 0]),
                        zoom: 2,
                        minZoom: 1,
                        maxZoom: 18
                    }),
                    controls: []
                });

                // 🖱️ Click cluster → zoom in
                mapInstance.current.on("click", (evt) => {
                    // Don't zoom if we're in edit mode
                    if (editMode) return;

                    mapInstance.current.forEachFeatureAtPixel(evt.pixel, (feature) => {
                        const f = feature.get("features");
                        if (!f || f.length <= 1) return;

                        const view = mapInstance.current.getView();
                        view.animate({
                            center: evt.coordinate,
                            zoom: view.getZoom() + 2,
                            duration: 300
                        });
                    });
                });

                // 🖐️ Pointer cursor
                mapInstance.current.on("pointermove", (e) => {
                    const hit = mapInstance.current.hasFeatureAtPixel(e.pixel);
                    mapInstance.current.getTargetElement().style.cursor =
                        editMode ? "move" : (hit ? "pointer" : "");
                });

            } catch (e) {
                console.error(e);
                showSnackbar("Failed to load map data", "error");
            }
        })();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(null);
            }
        };
    }, []);

    // Clean up interactions when component unmounts
    useEffect(() => {
        return () => {
            if (mapInstance.current) {
                if (modifyInteractionRef.current) {
                    mapInstance.current.removeInteraction(modifyInteractionRef.current);
                }
                if (selectInteractionRef.current) {
                    mapInstance.current.removeInteraction(selectInteractionRef.current);
                }
            }
        };
    }, []);

    // ================= SNACKBAR =================
    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const closeSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // ================= UI =================
    return (
        <div>
            <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Archive</InputLabel>
                    <Select
                        value={selectedFeature}
                        label="Archive"
                        onChange={e => setSelectedFeature(e.target.value)}
                    >
                        {featureOptions.map(o => (
                            <MenuItem key={o} value={o}>{o}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={fetchFileByName}
                    disabled={!selectedFeature || loading.blob}
                >
                    Fetch File
                </Button>

                <Button
                    variant="contained"
                    onClick={downloadFromBase64}
                    disabled={!base64File || loading.base64}
                >
                    Download Base64
                </Button>

                <Button
                    variant={editMode ? "contained" : "outlined"}
                    color={editMode ? "secondary" : "primary"}
                    onClick={toggleEditMode}
                >
                    {editMode ? "Exit Edit Mode" : "Edit Mode"}
                </Button>

                {(loading.base64 || loading.blob) && <CircularProgress size={24} />}

                {editMode && (
                    <Alert severity="info" sx={{ ml: 2 }}>
                        Drag icons to move them. Moved features: {movedFeatures.length}
                    </Alert>
                )}
            </Box>

            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "calc(100vh - 120px)",
                    border: editMode ? "2px solid #1976d2" : "none"
                }}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={closeSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default OpenLayersImageMap;