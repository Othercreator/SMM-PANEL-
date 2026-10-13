import React from 'react';
import { Layers } from 'lucide-react';

export type PlatformOption = 
  | 'All Services'
  | 'Facebook'
  | 'Instagram'
  | 'YouTube'
  | 'TikTok'
  | 'Telegram'
  | 'X / Twitter'
  | 'Threads'
  | 'LinkedIn'
  | 'Discord'
  | 'WhatsApp'
  | 'Spotify'
  | 'Music & Streaming'
  | 'Other Services';

interface PlatformNavigationMenuProps {
  selectedPlatform: PlatformOption;
  onSelectPlatform: (platform: PlatformOption) => void;
  serviceCounts: Record<PlatformOption, number>;
}

interface PlatformConfig {
  id: PlatformOption;
  label: string;
  shortLabel?: string;
  icon: (props: { className?: string }) => React.ReactElement;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  activeGlow: string;
  iconActiveColor: string;
  hoverBorder: string;
  badgeActiveBg: string;
  badgeActiveText: string;
  accentBar: string;
}

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: 'All Services',
    label: 'All Services',
    shortLabel: 'All',
    icon: ({ className = 'w-5 h-5' }) => (
      <Layers className={className} />
    ),
    activeBg: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/10',
    activeText: 'text-white',
    activeGlow: 'from-emerald-500/20 to-teal-500/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-emerald-300 hover:bg-emerald-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-emerald-500'
  },
  {
    id: 'Facebook',
    label: 'Facebook',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    activeBg: 'bg-[#1877F2]',
    activeBorder: 'border-[#1877F2] ring-2 ring-[#1877F2]/20 shadow-md shadow-[#1877F2]/15',
    activeText: 'text-white',
    activeGlow: 'from-blue-500/20 to-blue-600/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-blue-300 hover:bg-blue-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-[#1877F2]'
  },
  {
    id: 'Instagram',
    label: 'Instagram',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    activeBg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    activeBorder: 'border-[#DD2A7B] ring-2 ring-pink-500/20 shadow-md shadow-pink-500/15',
    activeText: 'text-white',
    activeGlow: 'from-pink-500/20 to-purple-500/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-pink-300 hover:bg-pink-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-[#DD2A7B]'
  },
  {
    id: 'YouTube',
    label: 'YouTube',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    activeBg: 'bg-[#FF0000]',
    activeBorder: 'border-[#FF0000] ring-2 ring-red-500/20 shadow-md shadow-red-500/15',
    activeText: 'text-white',
    activeGlow: 'from-red-500/20 to-red-600/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-red-300 hover:bg-red-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-[#FF0000]'
  },
  {
    id: 'TikTok',
    label: 'TikTok',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.043.87.128V9.41a6.33 6.33 0 0 0-.87-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.79 5.34 6.31 6.31 0 0 0 2.89-5.35V8.58a8.28 8.28 0 0 0 4.84 1.56V6.69z"/>
      </svg>
    ),
    activeBg: 'bg-slate-900',
    activeBorder: 'border-slate-800 ring-2 ring-slate-800/20 shadow-md shadow-slate-900/15',
    activeText: 'text-white',
    activeGlow: 'from-slate-800/20 to-slate-900/20',
    iconActiveColor: 'text-[#00F2FE]',
    hoverBorder: 'hover:border-slate-400 hover:bg-slate-50',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-slate-900'
  },
  {
    id: 'Telegram',
    label: 'Telegram',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    activeBg: 'bg-[#229ED9]',
    activeBorder: 'border-[#229ED9] ring-2 ring-sky-500/20 shadow-md shadow-sky-500/15',
    activeText: 'text-white',
    activeGlow: 'from-sky-400/20 to-sky-500/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-sky-300 hover:bg-sky-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-[#229ED9]'
  },
  {
    id: 'X / Twitter',
    label: 'X / Twitter',
    shortLabel: 'X / Twitter',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    activeBg: 'bg-black',
    activeBorder: 'border-black ring-2 ring-black/20 shadow-md shadow-black/15',
    activeText: 'text-white',
    activeGlow: 'from-slate-700/20 to-black/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-slate-400 hover:bg-slate-50',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-black'
  },
  {
    id: 'Threads',
    label: 'Threads',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24C5.467 24 0 18.533 0 11.814 0 5.095 5.467 0 12.186 0c6.643 0 11.968 5.253 12.181 11.863h-2.934c-.207-4.996-4.32-8.929-9.247-8.929-5.119 0-9.252 4.133-9.252 9.252 0 5.119 4.133 9.252 9.252 9.252 4.316 0 7.957-2.99 8.977-7.065h-8.977v-2.934h11.911c.013.245.02.492.02.742 0 6.643-5.253 11.805-11.925 11.805z"/>
      </svg>
    ),
    activeBg: 'bg-[#101010]',
    activeBorder: 'border-black ring-2 ring-slate-900/20 shadow-md shadow-slate-900/15',
    activeText: 'text-white',
    activeGlow: 'from-slate-800/20 to-black/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-slate-400 hover:bg-slate-50',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-black'
  },
  {
    id: 'LinkedIn',
    label: 'LinkedIn',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    activeBg: 'bg-[#0A66C2]',
    activeBorder: 'border-[#0A66C2] ring-2 ring-blue-600/20 shadow-md shadow-blue-600/15',
    activeText: 'text-white',
    activeGlow: 'from-blue-600/20 to-blue-700/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-blue-400 hover:bg-blue-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-[#0A66C2]'
  },
  {
    id: 'Discord',
    label: 'Discord',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    activeBg: 'bg-[#5865F2]',
    activeBorder: 'border-[#5865F2] ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/15',
    activeText: 'text-white',
    activeGlow: 'from-indigo-500/20 to-purple-500/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-indigo-300 hover:bg-indigo-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-[#5865F2]'
  },
  {
    id: 'WhatsApp',
    label: 'WhatsApp',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 0C5.395 0 .017 5.378.017 12.014c0 2.12.553 4.187 1.605 6.01L0 24l6.177-1.62c1.768.964 3.766 1.472 5.854 1.472 6.636 0 12.014-5.378 12.014-12.014S18.667 0 12.031 0zm0 21.821c-1.807 0-3.578-.485-5.122-1.402l-.367-.218-3.805.998 1.016-3.71-.24-.381c-1.009-1.604-1.542-3.468-1.542-5.393 0-5.507 4.48-9.988 9.988-9.988 5.508 0 9.989 4.48 9.989 9.988 0 5.508-4.481 9.988-9.989 9.988zm5.474-7.487c-.3-.15-1.774-.875-2.049-.975-.274-.1-.474-.15-.674.15-.2.3-.774.975-.95 1.174-.174.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.489-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.131-.611.136-.134.3-.35.45-.524.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.674-1.624-.924-2.224-.244-.585-.492-.505-.675-.514-.174-.009-.374-.01-.574-.01-.2 0-.524.075-.799.375-.274.3-1.049 1.025-1.049 2.5 0 1.475 1.074 2.899 1.224 3.1.15.2 2.112 3.224 5.118 4.524.715.31 1.273.495 1.708.633.718.228 1.372.196 1.889.119.577-.086 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
      </svg>
    ),
    activeBg: 'bg-[#25D366]',
    activeBorder: 'border-[#25D366] ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/15',
    activeText: 'text-white',
    activeGlow: 'from-emerald-500/20 to-green-600/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-emerald-400 hover:bg-emerald-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-[#25D366]'
  },
  {
    id: 'Spotify',
    label: 'Spotify',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.497 17.303c-.216.353-.675.467-1.028.25-2.817-1.722-6.363-2.112-10.539-1.158-.403.093-.803-.16-.895-.563-.092-.403.16-.803.563-.895 4.572-1.045 8.489-.606 11.649 1.338.353.216.467.675.25 1.028zm1.468-3.26c-.272.441-.849.58-1.29.308-3.225-1.982-8.141-2.557-11.956-1.399-.496.15-1.024-.136-1.174-.632-.15-.496.136-1.024.632-1.174 4.364-1.324 9.782-.678 13.48 1.597.441.272.58.849.308 1.3zm.126-3.41c-3.868-2.296-10.25-2.508-13.948-1.385-.592.18-1.22-.154-1.4-.746-.18-.592.154-1.22.746-1.4 4.25-1.29 11.3-1.045 15.753 1.598.532.316.706 1.006.39 1.538-.316.532-1.006.706-1.541.395z"/>
      </svg>
    ),
    activeBg: 'bg-[#1DB954]',
    activeBorder: 'border-[#1DB954] ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/15',
    activeText: 'text-white',
    activeGlow: 'from-emerald-400/20 to-emerald-600/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-emerald-400 hover:bg-emerald-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-[#1DB954]'
  },
  {
    id: 'Music & Streaming',
    label: 'Music & Streaming',
    shortLabel: 'Music & Audio',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    ),
    activeBg: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600',
    activeBorder: 'border-violet-500 ring-2 ring-violet-500/20 shadow-md shadow-violet-500/15',
    activeText: 'text-white',
    activeGlow: 'from-violet-500/20 to-purple-600/20',
    iconActiveColor: 'text-white',
    hoverBorder: 'hover:border-violet-300 hover:bg-violet-50/40',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-violet-600'
  },
  {
    id: 'Other Services',
    label: 'Other Services',
    shortLabel: 'Other',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    activeBg: 'bg-gradient-to-r from-slate-800 to-slate-900',
    activeBorder: 'border-slate-800 ring-2 ring-slate-800/20 shadow-md shadow-slate-900/15',
    activeText: 'text-white',
    activeGlow: 'from-slate-700/20 to-slate-800/20',
    iconActiveColor: 'text-emerald-400',
    hoverBorder: 'hover:border-slate-400 hover:bg-slate-50',
    badgeActiveBg: 'bg-white/20 text-white',
    badgeActiveText: 'text-white font-extrabold',
    accentBar: 'bg-slate-700'
  }
];

export const PlatformNavigationMenu: React.FC<PlatformNavigationMenuProps> = ({
  selectedPlatform,
  onSelectPlatform,
  serviceCounts
}) => {
  return (
    <div className="space-y-2">
      {/* Platform Section Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Select Social Media Platform
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            14 Platforms Supported
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
          Instant Live Filtering • All Services API Verified
        </span>
      </div>

      {/* Responsive Platform Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {PLATFORM_CONFIGS.map((config) => {
          const isSelected = selectedPlatform === config.id;
          const count = serviceCounts[config.id] || 0;
          const IconComponent = config.icon;

          return (
            <button
              key={config.id}
              onClick={() => onSelectPlatform(config.id)}
              className={`group relative flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl border transition-all text-left duration-150 ${
                isSelected
                  ? `${config.activeBg} ${config.activeBorder} ${config.activeText} shadow-sm -translate-y-0.5`
                  : `bg-white border-slate-200/90 text-slate-700 hover:shadow-xs hover:-translate-y-0.5 ${config.hoverBorder}`
              }`}
            >
              {/* Brand Icon Container */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/70'
                }`}
              >
                <IconComponent
                  className={`w-4 h-4 transition-colors ${
                    isSelected ? config.iconActiveColor : 'text-slate-700'
                  }`}
                />
              </div>

              {/* Title and Count */}
              <div className="min-w-0 flex-1">
                <span
                  className={`text-xs font-bold block truncate leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-900 group-hover:text-slate-950'
                  }`}
                >
                  {config.shortLabel || config.label}
                </span>
                <span
                  className={`text-[10px] font-semibold tabular-nums ${
                    isSelected ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  {count} {count === 1 ? 'service' : 'services'}
                </span>
              </div>

              {/* Selection Dot */}
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
