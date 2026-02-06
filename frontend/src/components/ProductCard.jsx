import { API_BASE_URL } from '../lib/api'
import './ProductCard.css'

const ProductCard = ({ product, onClick }) => {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const averageRating = product.average_rating || 0
  const reviewCount = product.reviews_count || 0

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image">
        {primaryImage ? (
          <img 
            src={`${API_BASE_URL.replace('/api', '')}/storage/${primaryImage.image_url}`} 
            alt={product.name}
          />
        ) : (
          <div className="product-image-placeholder">
            <span>Sem imagem</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="product-category">{product.category?.name}</span>
          {averageRating > 0 && (
            <span className="product-rating">
              ⭐ {averageRating.toFixed(1)} ({reviewCount})
            </span>
          )}
        </div>
        <p className="product-description">{product.description?.substring(0, 80)}...</p>
        <div className="product-footer">
          <span className="product-price">R$ {parseFloat(product.price).toFixed(2)}</span>
          <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
