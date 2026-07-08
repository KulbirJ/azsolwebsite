import React from "react";

const AuroraBackground: React.FC = () => (
  <div className="absolute inset-0 -z-10">
    <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 opacity-60 blur-2xl animate-pulse" />
    <div className="w-2/3 h-2/3 absolute top-1/4 left-1/4 bg-gradient-radial from-green-300 via-blue-400 to-purple-500 opacity-40 blur-3xl animate-spin-slow" />
  </div>
);

export default AuroraBackground;
