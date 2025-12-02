import React from 'react';
import Image from 'next/image';

const HeaderBackground = () => {
  return (
     <div className="fixed inset-0 -z-10 w-full h-screen bg-[#f4f9f6]">
      <img
        src="/sunset.jpg"
        alt="Background"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default HeaderBackground;
