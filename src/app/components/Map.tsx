// "use client";

// import { TileLayer, Marker } from "react-leaflet";

// import { MapContainer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// interface MapProps {
//   latitude: number;
//   longitude: number;
// }

// export default function Map({ latitude, longitude }: MapProps) {
//   return (
//     <MapContainer
//       center={[latitude, longitude]}
//       zoom={13}
//       style={{ height: "100%", width: "100%" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={[latitude, longitude]} />
//     </MapContainer>
//   );
// }
