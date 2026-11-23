import React, { useEffect, useRef, useState, useCallback } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
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
    MenuItem
} from "@mui/material";

import doorBlue from "../Images/door-blue.png";
import { createCircleFeature } from "../Function/Featurecreation";

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
            // Single marker
            styleCache[size] = new Style({
                image: new Icon({
                    src: doorBlue,
                    scale: 0.1,
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

    const [featureOptions, setFeatureOptions] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState("");

    const [base64File, setBase64File] = useState(null);
    const [blobFile, setBlobFile] = useState(null);
    const [headers, setHeaders] = useState(null);

    const [loading, setLoading] = useState({ base64: false, blob: false });

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
        } finally {
            setLoading(l => ({ ...l, blob: false }));
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

                // 🔹 Create features (NO STYLE HERE)
                const features = [];

                features.push(
                    new Feature({
                        geometry: new Point(fromLonLat([0, 0]))
                    })
                );

                features.push(
                    new Feature({
                        geometry: new Point(fromLonLat([5, 5]))
                    })
                );

                coords?.forEach(c =>
                    features.push(
                        new Feature({
                            geometry: new Point(fromLonLat([c.x, c.y])),
                            status: c.status
                        })
                    )
                );

                const vectorSource = new VectorSource({ features });

                const clusterSource = new Cluster({
                    distance: 40,
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
                    mapInstance.current.getTargetElement().style.cursor = hit ? "pointer" : "";
                });

            } catch (e) {
                console.error(e);
            }
        })();

        return () => mapInstance.current?.setTarget(null);
    }, []);

    // ================= UI =================
    return (
        <div>
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

            <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
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

                {(loading.base64 || loading.blob) && <CircularProgress size={24} />}
            </Box>

            <div ref={mapRef} style={{ width: "100%", height: "calc(100vh - 80px)" }} />
        </div>
    );
};

export default OpenLayersImageMap;
