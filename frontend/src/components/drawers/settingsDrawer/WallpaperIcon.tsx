import React from "react";

function WallpaperIcon({
  size = 25,
  ...props
}: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
    >
      <path d="M3,22H21a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V21A1,1,0,0,0,3,22Zm2.414-2L10,15.414l1.293,1.293a1,1,0,0,0,1.414,0L17,12.414l3,3V20ZM20,4v8.586l-2.293-2.293a1,1,0,0,0-1.414,0L12,14.586l-1.293-1.293a1,1,0,0,0-1.414,0L4,18.586V4ZM6,8.5A2.5,2.5,0,1,1,8.5,11,2.5,2.5,0,0,1,6,8.5Z" />
    </svg>
  );
}

export default WallpaperIcon;
