'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import L from 'leaflet';



const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });



export default function Map({pos1,pos2}:{pos1:any,pos2:any}) {
  const [mapReady, setMapReady] = useState<boolean>(false);

  useEffect(() => {
   
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return <p>Loading map...</p>;
  }

  return (
    <MapContainer center={pos1} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={pos1}>
        <Popup>A pretty popup. Easily customizable.</Popup>
      </Marker>
      <Marker position={pos2} >
          <Popup>
            You are here.
          </Popup>
        </Marker>
    </MapContainer>
  );
}
