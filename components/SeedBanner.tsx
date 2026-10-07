export function SeedBanner({ show, text }: { show: boolean; text: string }) {
  if (!show) return null
  return (
    <div className="seed-banner" role="note">
      {text}
    </div>
  )
}
