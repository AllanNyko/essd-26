import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Status from '../../components/Status'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const loadProduct = async () => {
    setStatus({ loading: true, error: '', success: '' })
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      const data = await parseJson(response)
      
      if (response.ok) {
        setProduct(data?.product)
        setSelectedImage(data?.product?.images?.[0])
      } else {
        throw new Error(data?.message || 'Erro ao carregar produto.')
      }
      setStatus({ loading: false, error: '', success: '' })
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  useEffect(() => {
    loadProduct()
  }, [id])

  const handleAddToCart = async () => {
    setStatus({ loading: true, error: '', success: '' })
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao adicionar ao carrinho.')
      }

      setStatus({ loading: false, error: '', success: 'Produto adicionado ao carrinho!' })
      setTimeout(() => navigate('/cart'), 1500)
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  if (status.loading && !product) {
    return <div className="loading">Carregando...</div>
  }

  if (!product) {
    return <div className="error">Produto não encontrado.</div>
  }

  const primaryImage = selectedImage || product.images?.[0]

  return (
    <div className="product-detail">
      <div className="product-images">
        <div className="main-image">
          {primaryImage ? (
            <img 
              src={`${API_BASE_URL}/storage/${primaryImage.image_url}`} 
              alt={product.name}
            />
          ) : (
            <div className="no-image">Sem imagem</div>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="image-thumbnails">
            {product.images.map(img => (
              <img
                key={img.id}
                src={`${API_BASE_URL}/storage/${img.image_url}`}
                alt={product.name}
                className={selectedImage?.id === img.id ? 'active' : ''}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info-section">
        <div className="breadcrumb">
          <span onClick={() => navigate('/shop')}>Loja</span>
          {' > '}
          <span>{product.category?.name}</span>
        </div>

        <h1>{product.name}</h1>

        <div className="product-meta">
          <span className="vendor">
            Vendedor: <strong>{product.vendor?.name}</strong>
          </span>
          {product.average_rating > 0 && (
            <span className="rating">
              ⭐ {product.average_rating.toFixed(1)} ({product.reviews_count} avaliações)
            </span>
          )}
        </div>

        <div className="price-section">
          <span className="price">R$ {parseFloat(product.price).toFixed(2)}</span>
          <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
          </span>
        </div>

        <div className="description">
          <h3>Descrição</h3>
          <p>{product.description}</p>
        </div>

        {product.stock > 0 && (
          <div className="purchase-section">
            <div className="quantity-selector">
              <label>Quantidade:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={product.stock}
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button 
              className="add-to-cart primary"
              onClick={handleAddToCart}
              disabled={status.loading}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        )}

        {status.error && <Status type="error" message={status.error} />}
        {status.success && <Status type="success" message={status.success} />}
      </div>
    </div>
  )
}

export default ProductDetail
