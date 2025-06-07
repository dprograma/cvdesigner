'use client';

import dynamic from 'next/dynamic';

// Import Navbar with no SSR to avoid hydration issues with auth state
const Navbar = dynamic(() => import('@/app/components/layout/Navbar'), {
  ssr: false,
});

export default function NavbarWrapper() {
  return <Navbar />;
}
