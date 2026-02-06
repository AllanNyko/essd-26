import { useEffect, useState } from 'react'
import Status from '../../components/Status'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './VendorOrders.css'

const VendorOrders = () => {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const loadOrders = async () => {
    setStatus({ loading: true, error: '', success: '' })
    try {
      const url = filter === 'all' 
        ? `${API_BASE_URL}/vendor/orders`
        : `${API_BASE_URL}/vendor/orders?status=${filter}`
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      })
      const data = await parseJson(response)
      
      if (response.ok) {
        setOrders(data?.data || [])
      } else {
        throw new Error(data?.message || 'Erro ao carregar pedidos.')
      }
      setStatus({ loading: false, error: '', success: '' })
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  useEffect(() => {
    loadOrders()
  }, [filter])

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendente',
      processing: 'Em Processamento',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    }
    return labels[status] || status
  }

  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    }
    return classes[status] || ''
  }

  return (
    <div className="vendor-orders">
      <div className="orders-header">
        <h1>Meus Pedidos</h1>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pendentes
          </button>
          <button 
            className={filter === 'processing' ? 'active' : ''} 
            onClick={() => setFilter('processing')}
          >
            Processando
          </button>
          <button 
            className={filter === 'shipped' ? 'active' : ''} 
            onClick={() => setFilter('shipped')}
          >
            Enviados
          </button>
        </div>
      </div>

      {status.error && <Status type="error" message={status.error} />}
      {status.loading && <p>Carregando pedidos...</p>}

      {!status.loading && orders.length === 0 && (
        <div className="empty-state">
          <p>Nenhum pedido encontrado.</p>
        </div>
      )}

      {!status.loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((orderItem) => (
            <div key={orderItem.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Pedido #{orderItem.order.order_number}</h3>
                  <p className="order-date">
                    {new Date(orderItem.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`order-status ${getStatusClass(orderItem.order.status)}`}>
                  {getStatusLabel(orderItem.order.status)}
                </span>
              </div>
              
              <div className="order-details">
                <div className="product-info">
                  <strong>{orderItem.product_name}</strong>
                  <p>Quantidade: {orderItem.quantity}</p>
                  <p>Valor unitário: R$ {parseFloat(orderItem.unit_price).toFixed(2)}</p>
                  <p className="subtotal">
                    Subtotal: R$ {parseFloat(orderItem.subtotal).toFixed(2)}
                  </p>
                </div>
                
                <div className="customer-info">
                  <h4>Cliente</h4>
                  <p>{orderItem.order.user.name}</p>
                  <p>{orderItem.order.user.email}</p>
                </div>
                
                <div className="shipping-info">
                  <h4>Endereço de Entrega</h4>
                  <p>{orderItem.order.shipping_name}</p>
                  <p>{orderItem.order.shipping_address}</p>
                  <p>{orderItem.order.shipping_city} - {orderItem.order.shipping_state}</p>
                  <p>CEP: {orderItem.order.shipping_zip_code}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorOrders
