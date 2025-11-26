"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/logo.png';

interface HeaderProps {
  subtitle?: string;
  action?: React.ReactNode;
}

const Header = ({ subtitle: propSubtitle, action: propAction }: HeaderProps) => {
  const pathname = usePathname();

  let subtitle = propSubtitle;
  let action = propAction;

  // Route-based customization
  if (pathname === '/test') {
    subtitle = "Compliance Risk Score Tool";
    action = (
      <Link href="/" className="text-gray-600 font-medium hover:text-gray-900">
        Exit
      </Link>
    );
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 md:px-12 flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Image
            src={logo}
            alt="Theraptly Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          {/* Logo Text */}
          <span className="text-[#0D25FF] font-bold text-xl tracking-tight">Theraptly</span>
        </div>

        {subtitle && (
          <>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <span className="text-gray-700 font-medium">{subtitle}</span>
          </>
        )}
      </div>

      {action && (
        <div>
          {action}
        </div>
      )}
    </header>
  );
};

export default Header;
