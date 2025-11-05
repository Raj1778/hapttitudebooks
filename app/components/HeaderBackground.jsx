import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const HeaderBackground = () => {
  return (
   
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <Image
          src="/finalbg.jpg  "
          alt="Background"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[center_top_30%]"
        />
      </div>
  )
}

export default HeaderBackground
