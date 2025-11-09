import React from 'react';
import Image from 'next/image';

const HeaderBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 w-full h-screen bg-[#f4f9f6]">
      <Image
        src="/bgfinal.jpg"
        alt="Background"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover object-[center_top_30%]"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
      />
    </div>
  );
};

export default HeaderBackground;
