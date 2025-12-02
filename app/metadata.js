// Base metadata configuration
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hapttitude-books.com';

export const baseMetadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Hapttitude Books - Empower Your Mind, Embrace Your Emotions',
    template: '%s | Hapttitude Books'
  },
  description: 'Discover transformative books that empower your mind, embrace your emotions, and build inner peace. Explore the Hapttitude Waves series and embark on a journey of self-discovery.',
  keywords: ['hapttitude', 'books', 'self-help', 'emotional intelligence', 'mindfulness', 'personal growth', 'spiritual books', 'indian authors'],
  authors: [{ name: 'Hapttitude Books' }],
  creator: 'Hapttitude Books',
  publisher: 'WavePrint Publications',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Hapttitude Books',
    title: 'Hapttitude Books - Empower Your Mind, Embrace Your Emotions',
    description: 'Discover transformative books that empower your mind, embrace your emotions, and build inner peace.',
    images: [
      {
        url: '/wave-1.png',
        width: 1200,
        height: 630,
        alt: 'Hapttitude Books',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hapttitude Books - Empower Your Mind, Embrace Your Emotions',
    description: 'Discover transformative books that empower your mind, embrace your emotions, and build inner peace.',
    images: ['/wave-1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#244d38',
};

