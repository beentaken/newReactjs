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

// ================= COMPONENT =================
const MoveImageMap = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const vectorSourceRef = useRef(null);
    const modifyInteractionRef = useRef(null);
    const selectInteractionRef = useRef(null);
    const directVectorLayerRef = useRef(null);
    const clusterLayerRef = useRef(null);

    const [featureOptions, setFeatureOptions] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState("");

    const [base64File, setBase64File] = useState(null);
    const [blobFile, setBlobFile] = useState(null);
    const [headers, setHeaders] = useState(null);

    const [loading, setLoading] = useState({ base64: false, blob: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [editMode, setEditMode] = useState(false);
    const [movedFeatures, setMovedFeatures] = useState([]);

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
                `/Archive/GetArchiveFile?filename=${encodeURIComponent(selectedFeature)}`
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

    // ================= CLUSTER STYLE =================
    const styleCache = useRef({});

    const getClusterStyle = useCallback((feature, isEditMode = false) => {
        const size = feature.get("features")?.length || 1;

        // In edit mode, always show individual icons for easier dragging
        if (isEditMode) {
            return new Style({
                image: new Icon({
                    src: "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
                    scale: 0.5,
                    anchor: [0.5, 1],
                    crossOrigin: "anonymous"
                })
            });
        }

        // Regular cluster styling
        if (size === 1) {
            return new Style({
                image: new Icon({
                    src: "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
                    scale: 0.4,
                    anchor: [0.5, 1],
                    crossOrigin: "anonymous"
                })
            });
        }

        // Cluster styling
        return new Style({
            image: new Circle({
                radius: 15 + Math.min(size, 10),
                fill: new Fill({ color: `rgba(25, 118, 210, ${0.7 + Math.min(size / 20, 0.3)})` }),
                stroke: new Stroke({ color: "#ffffff", width: 3 })
            }),
            text: new Text({
                text: size.toString(),
                fill: new Fill({ color: "#ffffff" }),
                font: "bold 14px sans-serif",
                stroke: new Stroke({ color: "#000000", width: 2 })
            })
        });
    }, []);

    // ================= EDIT MODE FUNCTIONS =================
    const toggleEditMode = () => {
        const newEditMode = !editMode;
        setEditMode(newEditMode);

        if (mapInstance.current && vectorSourceRef.current) {
            if (newEditMode) {
                // ENTER EDIT MODE

                // Remove cluster layer
                if (clusterLayerRef.current) {
                    mapInstance.current.removeLayer(clusterLayerRef.current);
                    clusterLayerRef.current = null;
                }

                // Add direct vector layer for editing (shows individual icons)
                directVectorLayerRef.current = new VectorLayer({
                    source: vectorSourceRef.current,
                    style: (feature) => {
                        return new Style({
                            image: new Icon({
                                src: "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
                                scale: 0.5,
                                anchor: [0.5, 1],
                                crossOrigin: "anonymous"
                            })
                        });
                    }
                });
                mapInstance.current.addLayer(directVectorLayerRef.current);

                // Add modify interaction for dragging
                if (!modifyInteractionRef.current) {
                    modifyInteractionRef.current = new Modify({
                        source: vectorSourceRef.current,
                        pixelTolerance: 15,
                        wrapX: false
                    });
                }

                // Add select interaction to highlight features
                if (!selectInteractionRef.current) {
                    selectInteractionRef.current = new OlSelect({
                        style: new Style({
                            image: new Icon({
                                src: "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
                                scale: 0.6,
                                anchor: [0.5, 1],
                                crossOrigin: "anonymous"
                            })
                        })
                    });
                }

                mapInstance.current.addInteraction(modifyInteractionRef.current);
                mapInstance.current.addInteraction(selectInteractionRef.current);

                showSnackbar("Edit mode enabled. Drag icons to move them.", "info");

            } else {
                // EXIT EDIT MODE

                // Remove direct vector layer
                if (directVectorLayerRef.current) {
                    mapInstance.current.removeLayer(directVectorLayerRef.current);
                    directVectorLayerRef.current = null;
                }

                // Restore cluster layer
                const clusterSource = new Cluster({
                    distance: 40,
                    source: vectorSourceRef.current
                });

                clusterLayerRef.current = new VectorLayer({
                    source: clusterSource,
                    style: (feature) => getClusterStyle(feature, false)
                });
                mapInstance.current.addLayer(clusterLayerRef.current);

                // Remove interactions
                if (modifyInteractionRef.current) {
                    mapInstance.current.removeInteraction(modifyInteractionRef.current);
                }
                if (selectInteractionRef.current) {
                    mapInstance.current.removeInteraction(selectInteractionRef.current);
                }

                // Show moved features summary
                if (movedFeatures.length > 0) {
                    console.log("Moved features coordinates:", movedFeatures);
                    showSnackbar(`${movedFeatures.length} features moved. Check console for coordinates.`, "success");

                    // Optional: Send to API
                    // updateCoordinates(movedFeatures);
                } else {
                    showSnackbar("Edit mode disabled", "info");
                }
            }
        }
    };

    // Function to update coordinates on server
    const updateCoordinates = async (features) => {
        try {
            const updates = features.map(f => ({
                id: f.id,
                x: f.x,
                y: f.y
            }));

            console.log("Sending updates to server:", updates);

            // Uncomment when you have API endpoint
            // await fetch("/api/Minimap/UpdateCoordinates", {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(updates)
            // });

            showSnackbar("Coordinates updated on server", "success");
            setMovedFeatures([]); // Clear after successful update
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
                    fetchJson("/api/Minimap/GetCoordinates"),
                    fetchJson("/Archive/GetArchive64"),
                    fetchJson("/Archive/GetArchiveOptions")
                ]);

                setBase64File(archive64);
                setFeatureOptions(options);

                // Create features
                const features = [];

                // Add sample features
                features.push(
                    new Feature({
                        geometry: new Point(fromLonLat([0, 0])),
                        id: "feature_0",
                        name: "Sample Door 1",
                        type: "door"
                    })
                );

                features.push(
                    new Feature({
                        geometry: new Point(fromLonLat([5, 5])),
                        id: "feature_1",
                        name: "Sample Door 2",
                        type: "door"
                    })
                );

                // Add coordinates from API
                coords?.forEach((c, index) =>
                    features.push(
                        new Feature({
                            geometry: new Point(fromLonLat([c.x, c.y])),
                            status: c.status,
                            id: c.id || `coord_${index}`,
                            name: c.name || `Door ${index + 1}`,
                            type: "door"
                        })
                    )
                );

                // Create vector source
                const vectorSource = new VectorSource({ features });
                vectorSourceRef.current = vectorSource;

                // Track feature movements
                vectorSource.on('change', (event) => {
                    if (editMode) {
                        const moved = [];
                        vectorSource.forEachFeature((feature) => {
                            const geometry = feature.getGeometry();
                            if (geometry && geometry instanceof Point) {
                                const coords = geometry.getCoordinates();
                                const lonLat = toLonLat(coords);

                                moved.push({
                                    id: feature.getId() || feature.get('id'),
                                    name: feature.get('name') || 'Unnamed',
                                    x: lonLat[0],
                                    y: lonLat[1],
                                    type: feature.get('type') || 'feature'
                                });
                            }
                        });

                        // Update state with unique features
                        setMovedFeatures(prev => {
                            const unique = [...moved];
                            return unique;
                        });
                    }
                });

                // Create cluster source
                const clusterSource = new Cluster({
                    distance: 40,
                    source: vectorSource
                });

                // Create cluster layer
                clusterLayerRef.current = new VectorLayer({
                    source: clusterSource,
                    style: (feature) => getClusterStyle(feature, false)
                });

                // Initialize map
                mapInstance.current = new Map({
                    target: mapRef.current,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                            preload: Infinity
                        }),
                        clusterLayerRef.current
                    ],
                    view: new View({
                        center: fromLonLat([0, 0]),
                        zoom: 2,
                        minZoom: 1,
                        maxZoom: 19
                    }),
                    controls: []
                });

                // Cluster click zoom
                mapInstance.current.on("click", (evt) => {
                    if (editMode) return;

                    mapInstance.current.forEachFeatureAtPixel(evt.pixel, (feature) => {
                        const clusterFeatures = feature.get("features");
                        if (clusterFeatures && clusterFeatures.length > 1) {
                            const view = mapInstance.current.getView();
                            view.animate({
                                center: evt.coordinate,
                                zoom: view.getZoom() + 1,
                                duration: 250
                            });
                        }
                    });
                });

                // Pointer cursor
                mapInstance.current.on("pointermove", (e) => {
                    const hit = mapInstance.current.hasFeatureAtPixel(e.pixel);
                    mapInstance.current.getTargetElement().style.cursor =
                        editMode ? "move" : (hit ? "pointer" : "default");
                });

            } catch (e) {
                console.error("Map initialization error:", e);
                showSnackbar("Failed to load map data", "error");
            }
        })();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(null);
                mapInstance.current = null;
            }
        };
    }, [getClusterStyle]);

    // Clean up on unmount
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
            <Box sx={{
                p: 2,
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
                backgroundColor: "background.paper",
                borderBottom: 1,
                borderColor: "divider"
            }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Archive</InputLabel>
                    <Select
                        value={selectedFeature}
                        label="Archive"
                        onChange={e => setSelectedFeature(e.target.value)}
                    >
                        <MenuItem value=""><em>Select a file</em></MenuItem>
                        {featureOptions.map(o => (
                            <MenuItem key={o} value={o}>{o}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={fetchFileByName}
                    disabled={!selectedFeature || loading.blob}
                    startIcon={loading.blob ? <CircularProgress size={20} /> : null}
                >
                    Fetch File
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={downloadFromBase64}
                    disabled={!base64File || loading.base64}
                    startIcon={loading.base64 ? <CircularProgress size={20} /> : null}
                >
                    Download Base64
                </Button>

                <Button
                    variant={editMode ? "contained" : "outlined"}
                    color={editMode ? "warning" : "primary"}
                    onClick={toggleEditMode}
                    sx={{ ml: 2 }}
                >
                    {editMode ? "Exit Edit Mode" : "Edit Mode"}
                </Button>

                {editMode && (
                    <Alert
                        severity="info"
                        sx={{
                            ml: "auto",
                            "& .MuiAlert-message": {
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }
                        }}
                    >
                        <span>Drag icons to move</span>
                        {movedFeatures.length > 0 && (
                            <strong>({movedFeatures.length} moved)</strong>
                        )}
                    </Alert>
                )}
            </Box>

            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "calc(100vh - 120px)",
                    border: editMode ? "3px solid #ff9800" : "none",
                    boxSizing: "border-box"
                }}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={editMode ? 5000 : 3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Debug panel (optional) */}
            {process.env.NODE_ENV === 'development' && movedFeatures.length > 0 && (
                <Box sx={{
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderTop: 1,
                    borderColor: 'divider',
                    maxHeight: 200,
                    overflowY: 'auto'
                }}>
                    <strong>Moved Features:</strong>
                    <pre style={{ margin: 0, fontSize: 12 }}>
                        {JSON.stringify(movedFeatures, null, 2)}
                    </pre>
                </Box>
            )}
        </div>
    );
};

export default MoveImageMap;