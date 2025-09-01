import { CloudSnow } from "lucide-react";

const SnowIcon = ({ size = 24, className = "" }) => {
  return (
    <div className="relative">
      <CloudSnow
        size={size}
        className={`text-blue-500 ${className}`}
        style={{
          //animation: "bounce 2s infinite",
          filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))",
        }}
      />
      {/*
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 bg-white rounded-full"
            style={{
              animation: `fall 1.25s infinite`,
              animationDelay: `${i * 0.3}s`,
              left: `${i * 6}px`,
              opacity: 0,
            }}
          />
        ))}
      </div>*/}
    </div>
  );
};

export default SnowIcon;
