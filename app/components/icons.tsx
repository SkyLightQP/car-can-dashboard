import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const iconBase = {
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.75,
  viewBox: '0 0 24 24',
} as const;

export function GaugeIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 14l3.5-4" />
      <path d="M20.5 16a9 9 0 1 0-17 0" />
    </svg>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" />
      <path d="M3 13h18v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M6.5 17v1.5M17.5 17v1.5" />
    </svg>
  );
}

export function RouteIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6" />
    </svg>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M5.6 5.6L7 7M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4L7 17M17 7l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <rect height="10" rx="2" width="16" x="2" y="7" />
      <path d="M22 11v2" />
      <path d="M6 11v2M10 11v2" />
    </svg>
  );
}
