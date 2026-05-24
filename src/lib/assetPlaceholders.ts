function svgDataUrl(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function createImagePlaceholder(label: string, options: { height?: number; width?: number } = {}) {
  const width = options.width ?? 960
  const height = options.height ?? 640

  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F7FBFF" />
          <stop offset="1" stop-color="#E7F2F7" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)" />
      <rect x="${width * 0.08}" y="${height * 0.1}" width="${width * 0.84}" height="${height * 0.8}" rx="28" fill="#FFFFFF" stroke="#D6E5EE" stroke-width="4" />
      <circle cx="${width * 0.5}" cy="${height * 0.42}" r="${Math.min(width, height) * 0.16}" fill="#E8F8F2" />
      <path d="M ${width * 0.42} ${height * 0.42}h${width * 0.16}M ${width * 0.5} ${height * 0.34}v${height * 0.16}" stroke="#4CCD99" stroke-width="12" stroke-linecap="round" />
      <text x="50%" y="${height * 0.68}" fill="#123047" font-family="Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle">${label}</text>
      <text x="50%" y="${height * 0.76}" fill="#6B8295" font-family="Arial, sans-serif" font-size="22" text-anchor="middle">轻量占位图</text>
    </svg>
  `)
}

export function createIconPlaceholder(label: string, color = '#55CFFF') {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" width="247" height="247" viewBox="0 0 247 247">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${color}" />
          <stop offset="1" stop-color="#FFFFFF" />
        </linearGradient>
      </defs>
      <rect x="54" y="54" width="139" height="139" rx="28" fill="url(#g)" opacity="0.92" />
      <rect x="82" y="82" width="83" height="83" rx="18" fill="#07111F" opacity="0.28" />
      <text x="123.5" y="132" fill="#07111F" font-family="Arial, sans-serif" font-size="42" font-weight="700" text-anchor="middle">${label.slice(0, 1)}</text>
    </svg>
  `)
}

export const transparentSvg = svgDataUrl('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"/>')
