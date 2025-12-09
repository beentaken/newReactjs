import React, { useEffect, useRef, useState } from "react";
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
import { createCircleFeature } from '../Function/Featurecreation';
import { Button, CircularProgress, Box } from "@mui/material";
import doorBlue from "../Images/door-blue.png";

const OpenLayersImageMap = () => {
    const mapRef = useRef(null);
    const [fileinfo, setFileinfo] = useState(null);
    const [head, setHead] = useState(null);
    const [base64file, setBase64File] = useState(null);
    const [loading, setLoading] = useState({ base64: false, blob: false });
    const mapInstance = useRef(null); // Store map instance for cleanup

    // Fetch functions
    const fetchAllRandomCoordinates = async () => {
        try {
            const response = await fetch('https://localhost:44317/api/Minimap/GetCoordinates');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch coordinates:", error);
            return null;
        }
    };

    const fetchArchive64 = async () => {
        try {
            const response = await fetch('https://localhost:44317/Archive/GetArchive64');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch archive:", error);
            return null;
        }
    };

    const fetchArchiveblob = async () => {
        try {
            const response = await fetch('https://localhost:44317/Archive/GetArchiveBlob');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            setFileinfo(await response.blob());
            setHead(response.headers);
        } catch (error) {
            console.error("Failed to fetch archive:", error);
        }
    };

    const downloadbase64 = async () => {
        if (!base64file?.base64) {
            console.error("No base64 file available");
            return;
        }

        setLoading(prev => ({ ...prev, base64: true }));

        try {
            const base64Data = base64file.base64;
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = base64file.fileName || "download.bin";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up URL after a delay
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error("Base64 to File conversion failed:", error);
        } finally {
            setLoading(prev => ({ ...prev, base64: false }));
        }
    };

    const downloadBlob = () => {
        if (!fileinfo) {
            console.error("No blob file available");
            return;
        }

        setLoading(prev => ({ ...prev, blob: true }));

        // Use requestAnimationFrame instead of setTimeout for better timing
        requestAnimationFrame(() => {
            try {
                const url = window.URL.createObjectURL(fileinfo);
                const a = document.createElement("a");
                a.href = url;

                // Extract filename from headers
                let fileName = base64file.fileName;
                const contentDisposition = head?.get?.("Content-Disposition");

                if (contentDisposition) {
                    const match = contentDisposition.match(
                        /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/
                    );
                    if (match) {
                        fileName = decodeURIComponent(match[1] || match[2]);
                    }
                }

                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // Clean up URL
                setTimeout(() => window.URL.revokeObjectURL(url), 100);
            } catch (err) {
                console.error("downloadBlob error:", err);
            } finally {
                setLoading(prev => ({ ...prev, blob: false }));
            }
        });
    };

    // Initialize map
    useEffect(() => {
        const initMap = async () => {
            if (mapInstance.current) return; // Prevent multiple map initializations

            const [coordinates, archive64] = await Promise.all([
                fetchAllRandomCoordinates(),
                fetchArchive64()
            ]);

            await fetchArchiveblob();
            setBase64File(archive64);

            const center = fromLonLat([0, 0]);
            const features = [];

            // Add icon feature
            const featureIcon = new Feature({
                geometry: new Point(center),
            });

            featureIcon.setStyle(new Style({
                image: new Icon({
                    src: doorBlue,
                    scale: 0.1,
                    anchor: [0.5, 1],
                    crossOrigin: 'anonymous' // Important for CORS handling
                }),
            }));

            features.push(featureIcon);

            // Add circle point
            const featurePoint = new Feature({
                geometry: new Point(fromLonLat([5, 5])),
            });

            featurePoint.setStyle(new Style({
                image: new Circle({
                    radius: 6,
                    fill: new Fill({ color: "red" }),
                    stroke: new Stroke({ color: "white", width: 2 }),
                }),
            }));

            features.push(featurePoint);

            // Add circle features from coordinates
            if (coordinates?.length) {
                coordinates.forEach((item) => {
                    features.push(createCircleFeature([item.x, item.y], item.status));
                });
            }

            const vectorSource = new VectorSource({ features });
            const vectorLayer = new VectorLayer({ source: vectorSource });

            mapInstance.current = new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                        preload: Infinity // Improve loading
                    }),
                    vectorLayer,
                ],
                view: new View({
                    projection: "EPSG:3857",
                    center,
                    zoom: 2,
                    minZoom: 1, // Add constraints
                    maxZoom: 18
                }),
                controls: [] // Remove default controls if not needed
            });
        };

        initMap();

        // Cleanup function
        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(undefined);
                mapInstance.current = null;
            }
        };
    }, []);

    return (
        <div>
            <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                    onClick={downloadbase64}
                    disabled={loading.base64 || !base64file}
                    variant="contained"
                    color="primary"
                >
                    {loading.base64 ? "Preparing..." : "Download Base64"}
                </Button>
                <Button
                    onClick={downloadBlob}
                    disabled={loading.blob || !fileinfo}
                    variant="contained"
                    color="secondary"
                >
                    {loading.blob ? "Preparing..." : "Download Blob"}
                </Button>
                {(loading.base64 || loading.blob) && <CircularProgress size={24} />}
            </Box>
            <div
                ref={mapRef}
                style={{
                    width: "100%",
                    height: "calc(100vh - 80px)", // Account for button box height
                    position: "relative"
                }}
            />
        </div>
    );
};

export default OpenLayersImageMap;