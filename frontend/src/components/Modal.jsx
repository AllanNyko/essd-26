import { useEffect } from 'react'
import './Modal.css'

const Modal = ({ isOpen, onClose, title, children, showOkButton = true }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    // Cleanup quando componente desmonta
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Fechar modal">✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {showOkButton && (
          <div className="modal-footer">
            <button className="primary" onClick={onClose}>OK</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
