  import React from 'react'
  import Image from 'next/image'

  const Author = () => {
    return (
     <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] flex flex-col items-center px-4 sm:px-6 lg:px-20 pt-8 md:pt-12 lg:pt-16 pb-10 overflow-hidden">

        
        {/* Main Container */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-8 relative mb-6 md:mb-0">
          
          {/* Author Image - Mobile */}
          <div className="flex justify-center lg:hidden mb-6">
            <div className="relative w-56 h-56">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2f6d4c] to-[#244d38] rounded-2xl rotate-6"></div>
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/prettybhalla.jpg"
                  alt="Dr. Pretty Bhalla"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Author Image - Desktop */}
          <div className="hidden lg:block relative lg:w-1/2">
            <div className="absolute bottom-[-80px] left-56 z-10">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2f6d4c] to-[#244d38] rounded-2xl rotate-6"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/prettybhalla.jpg"
                    alt="Dr. Pretty Bhalla"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex flex-col justify-center lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1f3b2c]">
              Dr. Pretty Bhalla
            </h1>
            <p className="text-lg text-[#3a5a45] mt-2 font-medium">
              Professor & Hapttitude Coach
            </p>
            <p className="text-sm text-[#4a5a4f] mt-1">
              Lovely Professional University (LPU)
            </p>
            
            <p className="text-[#3c4a3f] mt-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
              An accomplished academic leader with over 15 years of experience in teaching, research, and consultancy. Pioneer of <span className="font-semibold text-[#2f6d4c]">Hapttitude</span>, integrating happiness into leadership and workplace culture.
            </p>

          
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="bg-gradient-to-br from-[#f8fdf9] to-[#edf6f0] mt-10 rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 max-w-6xl w-full flex flex-col lg:flex-row gap-8 lg:gap-12 relative border border-[#d5e9dc]/60">
          
          {/* Left - Biography */}
          <div className="lg:w-2/3 mt-6 mx-2 lg:mx-6">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-[#1f3b2c]">About</h2>
            
            <p className="text-[#3b4a3f] leading-relaxed mb-4">
              Dr. Pretty Bhalla is an accomplished academic leader with over 15 years of experience in teaching, research, and consultancy. She holds an Executive Development certification in Women of Color Leadership from Harvard Business School (2024) and a Ph.D. in Management.
            </p>
            
            <p className="text-[#3b4a3f] leading-relaxed mb-4">
              As a prolific researcher, she has authored Scopus-indexed papers and books, developed E-content, and secured copyrights. Dr. Bhalla pioneered <span className="font-semibold text-[#2f6d4c]">Hapttitude</span>, a groundbreaking approach that integrates happiness into leadership and workplace culture.
            </p>
            
            <p className="text-[#3b4a3f] leading-relaxed">
              She has conducted national and international workshops, Faculty Development Programs (FDPs), and consultancy projects, making significant contributions to academia, industry, and sustainable organizational well-being.
            </p>

            
          </div>

          {/* Right - Credentials */}
          <div className="lg:w-1/3 flex flex-col gap-5 sm:pt-4 md:pt-6 lg:pt-8">
            <div>
              <h3 className="font-semibold text-[#1f3b2c] mb-1">Education</h3>
              <p className="text-[#3b4a3f] text-sm">Ph.D. in Management</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#1f3b2c] mb-1">Certification</h3>
              <p className="text-[#3b4a3f] text-sm">Executive Development in Women of Color Leadership</p>
              <p className="text-[#4a5a4f] text-xs">Harvard Business School (2024)</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#1f3b2c] mb-1">Specialization</h3>
              <p className="text-[#3b4a3f] text-sm">Hapttitude & Organizational Culture</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#1f3b2c] mb-1">Institution</h3>
              <p className="text-[#3b4a3f] text-sm">Lovely Professional University</p>
            </div>
          </div>
        </div>

      </div>
    )
  }

  export default Author