import Image from 'next/image';

// NOTE: Consider renaming this file to `Avatar.tsx` for PascalCase consistency on case-insensitive filesystems.
// If you do, update any imports accordingly.

type AvatarProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

export function Avatar({ src, alt, size = 48, className = '' }: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}