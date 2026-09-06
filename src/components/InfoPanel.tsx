type InfoPanelProps = {
  visible: boolean
  title: string
  description: string
  onClose: () => void
  onExplore: () => void
}

function InfoPanel({
  visible,
  title,
  description,
  onClose,
  onExplore,
}: InfoPanelProps) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '30px',
        right: '30px',
        zIndex: 1000,
        background: 'white',
        color: 'black',
        padding: '20px',
        width: '300px',
        borderRadius: '12px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          border: 'none',
          background: 'transparent',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        ✕
      </button>

      <h2>{title}</h2>

      <p>{description}</p>

      {/* Explore button */}
      <button
        onClick={onExplore}
        style={{
          padding: '10px 16px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Explore landmark
      </button>
    </div>
  )
}

export default InfoPanel