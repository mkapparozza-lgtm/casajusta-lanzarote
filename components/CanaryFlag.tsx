// Bandera de Canarias sin escudo: tres franjas verticales iguales, blanco, azul y amarillo.
// Colores según la identidad gráfica del Gobierno de Canarias: Pantone 3005 (azul) y 7406 (amarillo).
export function CanaryFlag({ width = 30 }: { width?: number }) {
  const h = Math.round((width * 2) / 3)
  return (
    <svg className="canary-flag" width={width} height={h} viewBox="0 0 3 2" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="1" height="2" fill="#FFFFFF" />
      <rect x="1" y="0" width="1" height="2" fill="var(--flag-blue)" />
      <rect x="2" y="0" width="1" height="2" fill="var(--flag-yellow)" />
    </svg>
  )
}
