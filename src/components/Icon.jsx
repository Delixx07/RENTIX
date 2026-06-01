// Centralized line-icon set. Stroke-based, inherits color via currentColor.
// Usage: <Icon name="shield" size={20} />
const PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  shieldCheck: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 11 2 2 4-4" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  star: <path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 18.6 6.1 21.3l1.3-6.6L2.5 9.5l6.6-.8L12 2.5z" />,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.5 3h2l2.2 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21.5 7H6" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
  camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>,
  laptop: <><rect x="3" y="4" width="18" height="12" rx="2" /><line x1="2" y1="20" x2="22" y2="20" /></>,
  projector: <><rect x="2" y="7" width="20" height="11" rx="2" /><circle cx="15" cy="12.5" r="3" /><line x1="6" y1="11" x2="6" y2="11" /></>,
  audio: <><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M5 10v1a7 7 0 0 0 14 0v-1" /><line x1="12" y1="18" x2="12" y2="22" /></>,
  drone: <><rect x="9" y="9" width="6" height="6" rx="1" /><circle cx="5" cy="5" r="2.5" /><circle cx="19" cy="5" r="2.5" /><circle cx="5" cy="19" r="2.5" /><circle cx="19" cy="19" r="2.5" /><line x1="7" y1="7" x2="9.5" y2="9.5" /><line x1="17" y1="7" x2="14.5" y2="9.5" /><line x1="7" y1="17" x2="9.5" y2="14.5" /><line x1="17" y1="17" x2="14.5" y2="14.5" /></>,
  gimbal: <><path d="M12 3v6" /><circle cx="12" cy="12" r="3" /><path d="M7 12a5 5 0 0 0 10 0" /><path d="M12 15v6" /></>,
  radio: <><circle cx="12" cy="14" r="2" /><path d="M16.5 9.5a6 6 0 0 1 0 9M7.5 9.5a6 6 0 0 0 0 9M19.5 6.5a10 10 0 0 1 0 15M4.5 6.5a10 10 0 0 0 0 15" /></>,
  box: <><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.3 7 12 12 20.7 7" /><line x1="12" y1="22" x2="12" y2="12" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0" /><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6" /><path d="M21.5 21a6.5 6.5 0 0 0-5-6.3" /></>,
  store: <><path d="M3 9 4.5 4h15L21 9" /><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2" y="13" width="4" height="7" rx="1.5" /><rect x="18" y="13" width="4" height="7" rx="1.5" /><path d="M20 20a4 4 0 0 1-4 4h-2" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><polyline points="21 3 21 8 16 8" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><polyline points="3 21 3 16 8 16" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 9 12 4 17 9" /><line x1="12" y1="4" x2="12" y2="16" /></>,
  graduation: <><path d="M2 9.5 12 5l10 4.5L12 14 2 9.5z" /><path d="M6 11.5V16c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4.5" /><line x1="22" y1="9.5" x2="22" y2="14" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1" /><line x1="9" y1="7" x2="9" y2="7" /><line x1="15" y1="7" x2="15" y2="7" /><line x1="9" y1="11" x2="9" y2="11" /><line x1="15" y1="11" x2="15" y2="11" /><path d="M10 21v-4h4v4" /></>,
  tag: <><path d="M20.6 13.4 12 22l-9-9V4h9l8.6 8.6a1.4 1.4 0 0 1 0 2z" /><circle cx="7.5" cy="7.5" r="1.2" /></>,
  rocket: <><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0z" /><path d="M12 15 9 12c.5-3 2-6 7-9 1 5-2 6.5-5 7z" /><path d="M9 12H5l3-4h3.5M12 15v4l4-3v-3.5" /></>,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
  alert: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12" y2="17" /></>,
  data: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  handshake: <><path d="m11 17 2 2a1 1 0 0 0 1.4 0l3.6-3.6" /><path d="M14 7 12 5 8 9a2 2 0 0 0 0 2.8l.5.5a2 2 0 0 0 2.8 0L14 10" /><path d="m18 11 3-3-4-4-2 2" /><path d="m3 8 4-4 3 3" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
};

export default function Icon({ name, size = 20, strokeWidth = 2, className, style, ...rest }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      {...rest}
    >
      {path}
    </svg>
  );
}
