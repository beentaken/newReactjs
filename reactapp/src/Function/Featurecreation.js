// map-utils.js
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';

/**
 * Creates a red circle feature at the given lon/lat coordinates
 * @param {[number, number]} lonLat - Longitude and latitude
 * @returns {Feature}
 */
export function createCircleFeature(lonLat) {
    const point = new Point(fromLonLat(lonLat));
    const feature = new Feature({ geometry: point });

    const style = new Style({
        image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: 'red' }),
            stroke: new Stroke({ color: 'white', width: 2 }),
        }),
    });

    feature.setStyle(style);
    return feature;
}
