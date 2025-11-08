import { baseMetadata } from '../metadata';

export const metadata = {
  ...baseMetadata,
  title: 'Hapttitude Wave 1 - When Waves of Thought Become Waves of Light',
  description: 'Follow Aryan as he uncovers the hidden science behind human emotions, and how they ripple through the universe. A deeply emotional yet thought-provoking book that leaves you reflecting on what truly connects us all.',
  keywords: [...(baseMetadata.keywords || []), 'hapttitude wave 1', 'emotional intelligence', 'spiritual journey', 'aryan'],
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Hapttitude Wave 1 - When Waves of Thought Become Waves of Light',
    description: 'Follow Aryan as he uncovers the hidden science behind human emotions, and how they ripple through the universe.',
    url: '/hapttitude-wave1',
    images: [
      {
        url: '/book1.jpg',
        width: 1200,
        height: 630,
        alt: 'Hapttitude Wave 1 Book Cover',
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'Hapttitude Wave 1 - When Waves of Thought Become Waves of Light',
    description: 'Follow Aryan as he uncovers the hidden science behind human emotions, and how they ripple through the universe.',
    images: ['/book1.jpg'],
  },
  alternates: {
    canonical: '/hapttitude-wave1',
  },
};



