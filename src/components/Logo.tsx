/**
 * WTCmart Brand Logo Component
 * Modern high-tech emblem featuring stylized circuit badge and typography
 */

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', variant = 'full', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px] px-1 py-0.5' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', badge: 'text-xs px-2 py-0.5' }
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* High-Tech Vector Badge */}
      <div
        className={`${sizeClasses.icon} relative flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-md shadow-cyan-500/20 text-white font-black tracking-tighter`}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full p-1 fill-none stroke-white stroke-[2.5]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized W + T + C Circuit Pathways */}
          <path d="M6 12 L11 26 L16 14 L21 26 L26 12" />
          <path d="M22 8 L36 8 M29 8 L29 28" />
          <path d="M37 20 C37 17 33 16 30 18 C27 20 27 28 31 30 C34 31 37 29 37 27" />
          <circle cx="6" cy="12" r="1.5" className="fill-cyan-200 stroke-none" />
          <circle cx="26" cy="12" r="1.5" className="fill-cyan-200 stroke-none" />
          <circle cx="29" cy="28" r="1.5" className="fill-cyan-200 stroke-none" />
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex items-center tracking-tight">
          <span className={`font-extrabold ${sizeClasses.text} text-slate-900 tracking-tighter`}>
            WTC
          </span>
          <span className={`font-black ${sizeClasses.text} text-cyan-600 tracking-tight`}>
            mart
          </span>
          <span
            className={`ml-1.5 font-bold uppercase tracking-widest bg-slate-900 text-cyan-400 rounded ${sizeClasses.badge}`}
          >
            BD
          </span>
        </div>
      )}
    </div>
  );
}
