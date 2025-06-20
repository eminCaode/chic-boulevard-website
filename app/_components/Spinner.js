import React from "react";

const Spinner = () => {
  return (
    <div className="relative w-40 h-40 mx-auto">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-4 h-10 bg-gray-400  rounded-md"
          style={{
            transform: `rotate(${i * 45}deg) translate(0, -150%)`,
            transformOrigin: "center center",
            animation: `fade 1s linear infinite`,
            animationDelay: `${i * 0.125}s`,
          }}
        ></div>
      ))}
      <style>
        {`
          @keyframes fade {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;
