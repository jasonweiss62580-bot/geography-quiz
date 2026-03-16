import { memo } from 'react';
import { ComposableMap, Geographies, Geography } from '@vnedyalk0v/react19-simple-maps';
import type { Feature, Geometry } from 'geojson';
import geoUrl from 'us-atlas/states-10m.json';

const GEO_URL = geoUrl as unknown as Parameters<typeof Geographies>[0]['geography'];

/** Small non-interactive US map for use as a display icon. */
export const USMapIcon = memo(function USMapIcon() {
  return (
    <ComposableMap
      projection="geoAlbersUsa"
      width={200}
      height={125}
      style={{ width: '100%', height: '100%' }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }: { geographies: Feature<Geometry>[] }) =>
          geographies.map((geo) => {
            const id = String((geo as Feature<Geometry> & { id?: string | number }).id ?? '');
            return (
              <Geography
                key={id}
                geography={geo}
                style={{
                  default: { fill: '#4f46e5', stroke: '#4f46e5', strokeWidth: 0.5, outline: 'none' },
                  hover:   { fill: '#4f46e5', stroke: '#4f46e5', strokeWidth: 0.5, outline: 'none' },
                  pressed: { fill: '#4f46e5', stroke: '#4f46e5', strokeWidth: 0.5, outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
});
