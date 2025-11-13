import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  theme: 'light' | 'dark';
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ theme, alt, ...props }) => {
  if (theme === 'dark') {
    // Light Logo for Dark Mode
    return (
      <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* FIX: Add title for accessibility */}
        {alt && <title>{alt}</title>}
        <circle cx="64" cy="64" r="64" fill="url(#paint0_linear_dark)" />
        <circle cx="64" cy="64" r="56" fill="#1F2937" />
        <path d="M64 12C34.6243 12 12 34.6243 12 64C12 93.3757 34.6243 116 64 116" stroke="#10B981" strokeWidth="4" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="8s" repeatCount="indefinite" />
        </path>
        <circle cx="64" cy="20" r="4" fill="#A7F3D0" />
        <circle cx="108" cy="64" r="4" fill="#A7F3D0" />
        <circle cx="20" cy="64" r="4" fill="#A7F3D0" />
        {/* Robotic 'V' */}
        <path d="M44 52 L64 76 L84 52" stroke="#D1FAE5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M52 58 L64 70 L76 58" stroke="#A7F3D0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <defs>
          <linearGradient id="paint0_linear_dark" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" />
            <stop offset="1" stopColor="#A7F3D0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Dark Logo for Light Mode
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* FIX: Add title for accessibility */}
      {alt && <title>{alt}</title>}
      <circle cx="64" cy="64" r="64" fill="url(#paint0_linear_light)" />
      <circle cx="64" cy="64" r="56" fill="white" />
      <path d="M64 12C34.6243 12 12 34.6243 12 64C12 93.3757 34.6243 116 64 116" stroke="#10B981" strokeWidth="4" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="8s" repeatCount="indefinite" />
      </path>
      <circle cx="64" cy="20" r="4" fill="#059669" />
      <circle cx="108" cy="64" r="4" fill="#059669" />
      <circle cx="20" cy="64" r="4" fill="#059669" />
       {/* Robotic 'V' */}
      <path d="M44 52 L64 76 L84 52" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M52 58 L64 70 L76 58" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <defs>
        <linearGradient id="paint0_linear_light" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#A7F3D0" />
        </linearGradient>
      </defs>
    </svg>
  );
};