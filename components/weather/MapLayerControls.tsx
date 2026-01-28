// RisqMap/components/weather/MapLayerControls.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/Button'; // Assuming this path is correct

interface MapLayerControlsProps {
  activeLayer: string | null;
  setActiveLayer: (layer: string | null) => void;
}

export const MapLayerControls: React.FC<MapLayerControlsProps> = ({
  activeLayer,
  setActiveLayer,
}) => {
  const layers = [
    { name: 'Precipitation', value: 'precipitation_new' },
    { name: 'Clouds', value: 'clouds_new' },
    { name: 'Temperature', value: 'temp_new' },
    { name: 'Wind', value: 'wind_new' }, // Assuming 'wind_new' based on pattern
  ];

  const handleLayerClick = (layerValue: string) => {
    setActiveLayer(activeLayer === layerValue ? null : layerValue);
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2 p-2 bg-white rounded-lg shadow-lg">
      {layers.map((layer) => (
        <Button
          key={layer.value}
          onClick={() => handleLayerClick(layer.value)}
          variant={activeLayer === layer.value ? 'default' : 'outline'}
          className="w-32"
        >
          {layer.name}
        </Button>
      ))}
    </div>
  );
};
