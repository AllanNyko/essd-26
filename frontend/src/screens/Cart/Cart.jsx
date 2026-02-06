import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Status from '../../components/Status'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './Cart.css'

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const loadCart = async () => {
    setStatus({ loading: true, error: '', success: '' })
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders(),
      })
      const data = await parseJson(response)
      
      if (response.ok) {
        setCartItems(data?.cart_items || [])
        setTotal(data?.total || 0)
      } else {
        throw new Error(data?.message || 'Erro ao carregar carrinho.')
      }
      setStatus({ loading: false, error: '', success: '' })
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity: newQuantity }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao atualizar quantidade.')
      }

      loadCart()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao remover item.')
      }

      loadCart()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  const clearCart = async () => {
    if (!confirm('Deseja realmente limpar o carrinho?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao limpar carrinho.')
      }

      loadCart()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  if (status.loading && cartItems.length === 0) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h1>Carrinho de Compras</h1>
        {cartItems.length > 0 && (
          <button className="clear-cart" onClick={clearCart}>
            Limpar Carrinho
          </button>
        )}
      </div>

      {status.error && <Status type="error" message={status.error} />}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio.</p>
          <button className="primary" onClick={() => navigate('/shop')}>
            Ir para a Loja
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => {
              const primaryImage = item.product?.images?.find(img => img.is_primary) || item.product?.images?.[0]
              
              return (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    {primaryImage ? (
                      <img 
                        src={`${API_BASE_URL}/storage/${primaryImage.image_url}`} 
                        alt={item.product?.name}
                      />
                    ) : (
                      <div className="no-image">Sem imagem</div>
                    )}
                  </div>
                  
                  <div className="item-info">
                    <h3 
                      className="item-name"
                      onClick={() => navigate(`/shop/products/${item.product?.id}`)}
                    >
                      {item.product?.name}
                    </h3>
                    <p className="item-vendor">
                      Vendedor: {item.product?.vendor?.name}
                    </p>
                    <p className="item-price">
                      R$ {parseFloat(item.price_snapshot).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product?.stock}
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="item-subtotal">
                      R$ {(item.quantity * parseFloat(item.price_snapshot)).toFixed(2)}
                    </p>
                    
                    <button 
                      className="remove-item"
                      onClick={() => removeItem(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="cart-summary">
            <h2>Resumo do Pedido</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>R$ {parseFloat(total).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Frete:</span>
              <span>A calcular</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>R$ {parseFloat(total).toFixed(2)}</span>
            </div>
            <button 
              className="checkout-button primary"
              onClick={() => navigate('/checkout')}
            >
              Finalizar Compra
            </button>
            <button 
              className="continue-shopping"
              onClick={() => navigate('/shop')}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
