import { useState, useEffect } from 'react'
import './ImageUploader.css'

const ImageUploader = ({ images, setImages, maxImages = 5 }) => {
  const [previews, setPreviews] = useState([])

  // Sincronizar previews quando images for limpo
  useEffect(() => {
    if (images.length === 0) {
      setPreviews([])
    }
  }, [images])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const remainingSlots = maxImages - images.length
    const filesToAdd = files.slice(0, remainingSlots)

    setImages([...images, ...filesToAdd])

    filesToAdd.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  return (
    <div className="image-uploader">
      <label className="field">
        <span>Imagens do produto (máx. {maxImages})</span>
        <div className="image-upload-container">
          <div className="image-previews">
            {previews.map((preview, index) => (
              <div key={index} className="image-preview">
                <img src={preview} alt={`Preview ${index + 1}`} />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
                {index === 0 && <span className="primary-badge">Principal</span>}
              </div>
            ))}
          </div>
          {images.length < maxImages && (
            <label className="upload-button">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div className="upload-placeholder">
                <span>📷</span>
                <span>Adicionar imagens</span>
              </div>
            </label>
          )}
        </div>
      </label>
    </div>
  )
}

export default ImageUploader
