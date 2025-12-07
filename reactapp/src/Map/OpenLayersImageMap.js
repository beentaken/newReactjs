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
import { createCircleFeature } from '../Function/Featurecreation'; // adjust path
import { Button, CircularProgress, Box } from "@mui/material";
// Image asset
import doorBlue from "../Images/door-blue.png";

const fetchAllRandomCoordinates = async () => {
    try {
        const response = await fetch('https://localhost:44317/api/Minimap/GetCoordinates');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch coordinates:", error);
        return null;
    }
};

const fetchArchive64 = async () => {
    try {
        const response = await fetch('https://localhost:44317/Archive/GetArchive64');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch archive:", error);
        return null;
    }
};

const OpenLayersImageMap = () => {
    const mapRef = useRef(null);
    const [fileinfo, setFileinfo] = useState(null);
    const [base64file, setBase64File] = useState(null);
    const [loading, setLoading] = useState(false);

    const downloadbase64 = () => {
        setLoading(true);

        try {
            // Split the base64 string into metadata and data parts
            const base64 = fileinfo.base64;

            const bstr = atob(base64); // Decode Base64 to binary string
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            const file = new File([u8arr], fileinfo.fileName);

            // Create download link
            const url = window.URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileinfo.fileName);
            document.body.appendChild(link); // Required for Firefox
            link.click();
            document.body.removeChild(link); // Clean up
            window.URL.revokeObjectURL(url);

            setLoading(false);
        } catch (error) {
            console.error("Base64 to File conversion failed:", error.message);
            setLoading(false);
            return null;
        }
    };
    const downloadbaseBlob = () => {
        setLoading(true);

        try {
            // Split the base64 string into metadata and data parts
            const base64 = fileinfo.bytes;

            const bstr = atob(base64); // Decode Base64 to binary string
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            const file = new File([u8arr], fileinfo.fileName);

            // Create download link
            const url = window.URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileinfo.fileName);
            document.body.appendChild(link); // Required for Firefox
            link.click();
            document.body.removeChild(link); // Clean up
            window.URL.revokeObjectURL(url);

            setLoading(false);
        } catch (error) {
            console.error("Base64 to File conversion failed:", error.message);
            setLoading(false);
            return null;
        }
    };
    useEffect(() => {
        let map; // Declare here so we can clean up later

        const initMap = async () => {
            const coordinates = await fetchAllRandomCoordinates();
            console.log("Fetched Coordinates:", coordinates);
            const archive64 = await fetchArchive64();


            setFileinfo(archive64);
            const center = fromLonLat([0, 0]);
            const features = [];

            // Add icon feature
            const featureIcon = new Feature({
                geometry: new Point(fromLonLat([0, 0])),
            });

            featureIcon.setStyle(new Style({
                image: new Icon({
                    src: doorBlue,
                    scale: 0.1,
                    anchor: [0.5, 1],
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

            coordinates?.forEach((item, index) => {

                features.push(createCircleFeature([item.x, item.y], item.status));
            });
       
    
            const vectorLayer = new VectorLayer({
                source: new VectorSource({ features }),
            });

            map = new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({ source: new OSM() }),
                    vectorLayer,
                ],
                view: new View({
                    projection: "EPSG:3857",
                    center,
                    zoom: 2,
                }),
            });
        };

        initMap();

        return () => {
            if (map) map.setTarget(undefined);
        };
    }, []);

    return <div>

        <Box>
            <Button onClick={downloadbase64} disabled={loading} variant="contained">
                {loading ? "Preparing..." : "Download"}
            </Button>
            <Button onClick={downloadbaseBlob} disabled={loading} variant="contained">
                {loading ? "Preparing..." : "Download"}
            </Button>
            {loading && (
                <Box sx={{ mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
        <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
    </div>;
};

export default OpenLayersImageMap;
