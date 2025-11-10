import Image from "next/image";
import Link from "next/link";
import BackButton from "../components/BackButton";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f3ec] via-[#f4f9f6] to-[#fcfdfc] px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton fallbackHref="/" label="Back to Home" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1f3b2c] mb-4">
            About Us
          </h1>
          <div className="h-1 w-24 bg-[#2f6d4c] mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Mission Section */}
          <div className="bg-gradient-to-br from-[#f8fdf9] to-[#edf6f0] rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 border border-[#d5e9dc]/60">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f3b2c] mb-4">
              Our Mission
            </h2>
            <p className="text-[#3b4a3f] leading-relaxed text-lg">
              At Hapttitude Books, we believe in empowering young minds to navigate the complexities of modern life with emotional intelligence, resilience, and self-awareness. Our mission is to provide transformative stories that help children and teenagers understand their emotions, build confidence, and develop healthy coping mechanisms.
            </p>
          </div>

          {/* What We Do Section */}
          <div className="bg-gradient-to-br from-[#f8fdf9] to-[#edf6f0] rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 border border-[#d5e9dc]/60">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f3b2c] mb-4">
              What We Do
            </h2>
            <p className="text-[#3b4a3f] leading-relaxed text-lg mb-4">
              Through our Hapttitude Waves series, we address real-world challenges that today's youth face:
            </p>
            <ul className="list-disc list-inside text-[#3b4a3f] space-y-2 ml-4 text-lg">
              <li>Emotional awareness and expression</li>
              <li>Peer pressure and social dynamics</li>
              <li>Digital wellness and screen time management</li>
              <li>Academic stress and performance anxiety</li>
              <li>Identity formation and self-acceptance</li>
              <li>Building resilience and mental strength</li>
            </ul>
          </div>

          {/* Author Section */}
          <div className="bg-gradient-to-br from-[#f8fdf9] to-[#edf6f0] rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 border border-[#d5e9dc]/60">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/prettybhalla.jpg"
                    alt="Dr. Pretty Bhalla"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f3b2c] mb-4">
                  About the Author
                </h2>
                <p className="text-[#3b4a3f] leading-relaxed text-lg mb-4">
                  <strong className="text-[#1f3b2c]">Dr. Pretty Bhalla</strong> is a passionate educator and author dedicated to helping children and teenagers navigate the emotional challenges of growing up in the modern world. With years of experience in child psychology and emotional development, Dr. Bhalla brings a unique perspective to storytelling that combines empathy, understanding, and practical wisdom.
                </p>
                <p className="text-[#3b4a3f] leading-relaxed text-lg">
                  Her Hapttitude Waves series is designed to resonate with young readers, addressing their real concerns while providing tools for emotional growth and resilience.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-gradient-to-br from-[#f8fdf9] to-[#edf6f0] rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 border border-[#d5e9dc]/60">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f3b2c] mb-6">
              Our Values
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">💚</div>
                <h3 className="font-semibold text-[#1f3b2c] mb-2">Empathy</h3>
                <p className="text-[#3b4a3f] text-sm">Understanding and validating every child's emotional journey</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="font-semibold text-[#1f3b2c] mb-2">Growth</h3>
                <p className="text-[#3b4a3f] text-sm">Fostering continuous emotional and mental development</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-semibold text-[#1f3b2c] mb-2">Resilience</h3>
                <p className="text-[#3b4a3f] text-sm">Building strength to face life's challenges with confidence</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-semibold text-[#1f3b2c] mb-2">Education</h3>
                <p className="text-[#3b4a3f] text-sm">Making emotional intelligence accessible through stories</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-semibold text-[#1f3b2c] mb-2">Connection</h3>
                <p className="text-[#3b4a3f] text-sm">Creating meaningful bonds between readers and characters</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-semibold text-[#1f3b2c] mb-2">Transformation</h3>
                <p className="text-[#3b4a3f] text-sm">Inspiring positive change through powerful narratives</p>
              </div>
            </div>
          </div>

          {/* Contact/CTA Section */}
          <div className="bg-gradient-to-r from-[#244d38] to-[#2f6d4c] rounded-3xl shadow-lg p-8 sm:p-10 lg:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
              Join Us on This Journey
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              Explore our collection of transformative books designed to empower young minds and build emotional resilience.
            </p>
            <Link
              href="/#explore"
              className="inline-block px-8 py-3 bg-white text-[#2f6d4c] rounded-full font-semibold hover:bg-[#f5fff8] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Our Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
