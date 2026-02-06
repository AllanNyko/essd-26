import { useEffect, useState } from 'react'
import Status from '../../components/Status'
import Modal from '../../components/Modal'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './AdminVendors.css'

const AdminVendors = () => {
  const [vendors, setVendors] = useState([])
  const [filter, setFilter] = useState('all')
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [modal, setModal] = useState({ open: false, vendor: null, action: null })

  const loadVendors = async () => {
    setStatus({ loading: true, error: '', success: '' })
    try {
      const url = filter === 'all' 
        ? `${API_BASE_URL}/vendors`
        : `${API_BASE_URL}/vendors?status=${filter}`
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      })
      const data = await parseJson(response)
      
      if (response.ok) {
        setVendors(data?.data || [])
      } else {
        throw new Error(data?.message || 'Erro ao carregar vendedores.')
      }
      setStatus({ loading: false, error: '', success: '' })
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  useEffect(() => {
    loadVendors()
  }, [filter])

  const handleApprove = async () => {
    if (!modal.vendor?.id) return

    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${modal.vendor.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'approved' }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao aprovar vendedor.')
      }

      setModal({ open: false, vendor: null, action: null })
      setStatus({ loading: false, error: '', success: 'Vendedor aprovado com sucesso!' })
      loadVendors()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
      setModal({ open: false, vendor: null, action: null })
    }
  }

  const handleReject = async (reason) => {
    if (!modal.vendor?.id || !reason) return

    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${modal.vendor.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          status: 'rejected',
          rejection_reason: reason 
        }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao rejeitar vendedor.')
      }

      setModal({ open: false, vendor: null, action: null })
      setStatus({ loading: false, error: '', success: 'Vendedor rejeitado.' })
      loadVendors()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
      setModal({ open: false, vendor: null, action: null })
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    }
    return labels[status] || status
  }

  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
    }
    return classes[status] || ''
  }

  return (
    <div className="admin-vendors">
      <div className="vendors-header">
        <h1>Gerenciar Vendedores</h1>
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
            className={filter === 'approved' ? 'active' : ''} 
            onClick={() => setFilter('approved')}
          >
            Aprovados
          </button>
          <button 
            className={filter === 'rejected' ? 'active' : ''} 
            onClick={() => setFilter('rejected')}
          >
            Rejeitados
          </button>
        </div>
      </div>

      {status.error && <Status type="error" message={status.error} />}
      {status.success && <Status type="success" message={status.success} />}
      {status.loading && <p>Carregando vendedores...</p>}

      {!status.loading && vendors.length === 0 && (
        <div className="empty-state">
          <p>Nenhum vendedor encontrado.</p>
        </div>
      )}

      {!status.loading && vendors.length > 0 && (
        <div className="vendors-list">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="vendor-card">
              <div className="vendor-header">
                <div>
                  <h3>{vendor.company_name}</h3>
                  <p className="vendor-user">{vendor.user?.name} ({vendor.user?.email})</p>
                </div>
                <span className={`vendor-status ${getStatusClass(vendor.status)}`}>
                  {getStatusLabel(vendor.status)}
                </span>
              </div>
              
              <div className="vendor-details">
                <p><strong>CNPJ:</strong> {vendor.cnpj}</p>
                {vendor.phone && <p><strong>Telefone:</strong> {vendor.phone}</p>}
                {vendor.description && (
                  <p><strong>Descrição:</strong> {vendor.description}</p>
                )}
                {vendor.rejection_reason && (
                  <p className="rejection-reason">
                    <strong>Motivo da rejeição:</strong> {vendor.rejection_reason}
                  </p>
                )}
              </div>

              {vendor.status === 'pending' && (
                <div className="vendor-actions">
                  <button 
                    className="approve-btn"
                    onClick={() => setModal({ open: true, vendor, action: 'approve' })}
                  >
                    Aprovar
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => setModal({ open: true, vendor, action: 'reject' })}
                  >
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal.action === 'approve' && (
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, vendor: null, action: null })}
          title="Aprovar Vendedor"
        >
          <p>Deseja aprovar o vendedor <strong>{modal.vendor?.company_name}</strong>?</p>
          <div className="modal-actions">
            <button onClick={() => setModal({ open: false, vendor: null, action: null })}>
              Cancelar
            </button>
            <button className="approve" onClick={handleApprove}>
              Aprovar
            </button>
          </div>
        </Modal>
      )}

      {modal.action === 'reject' && (
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, vendor: null, action: null })}
          title="Rejeitar Vendedor"
        >
          <p>Informe o motivo da rejeição de <strong>{modal.vendor?.company_name}</strong>:</p>
          <textarea
            id="rejection-reason"
            rows="4"
            placeholder="Motivo da rejeição..."
            style={{ width: '100%', padding: '0.5rem', marginTop: '1rem' }}
          />
          <div className="modal-actions">
            <button onClick={() => setModal({ open: false, vendor: null, action: null })}>
              Cancelar
            </button>
            <button 
              className="reject" 
              onClick={() => {
                const reason = document.getElementById('rejection-reason').value
                if (reason.trim()) {
                  handleReject(reason)
                }
              }}
            >
              Rejeitar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminVendors
