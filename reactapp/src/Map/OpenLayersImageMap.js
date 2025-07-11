import React, { useEffect, useRef } from "react";
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

const OpenLayersImageMap = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        let map; // Declare here so we can clean up later

        const initMap = async () => {
            const coordinates = await fetchAllRandomCoordinates();
            console.log("Fetched Coordinates:", coordinates);

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

            coordinates.forEach((item, index) => {

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

    return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
};

export default OpenLayersImageMap;
