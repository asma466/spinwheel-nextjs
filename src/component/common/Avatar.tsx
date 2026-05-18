// // components/Avatar.tsx
// import React from "react";

// interface AvatarProps {
//   name: string;
//   imageUrl?: string; // Optional profile image
//   size?: number;     // Optional size, default = 40px
// }

// const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 40 }) => {
//   // Generate initials if image is not provided
//   const initials = name
//     .split(' ')
//     .map(n => n[0])
//     .slice(0, 2)
//     .join('')
//     .toUpperCase();

//   return imageUrl ? (
//     <img
//       src={imageUrl}
//       alt={name}
//       className="rounded-full object-cover"
//       style={{ width: size, height: size }}
//     />
//   ) : (
//     <div
//       className="rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary"
//       style={{ width: size, height: size }}
//     >
//       {initials}
//     </div>
//   );
// };

// export default Avatar;
// components/Avatar.tsx
import React from "react";

import Image from "next/image";

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
}

// Use button as the base element for proper accessibility & click
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, imageUrl, size = 40 }, ref) => {
    const initials = name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <div
        ref={ref}
        className="rounded-full flex items-center justify-center bg-primary/10 cursor-pointer border-none p-0 focus:outline-none overflow-hidden"
        style={{ width: size, height: size }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={size}
            height={size}
            className="rounded-full object-cover w-full h-full"
          />
        ) : (
          <span className="text-sm font-bold text-primary">{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;