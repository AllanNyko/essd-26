import { useEffect, useState } from 'react'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import Status from '../../components/Status'
import Modal from '../../components/Modal'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './AdminCategories.css'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [modal, setModal] = useState({ open: false, item: null })
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    is_active: true,
  })

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders(),
      })
      const data = await parseJson(response)
      if (response.ok) {
        setCategories(data?.categories || [])
      }
    } catch {
      setCategories([])
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
    
    if (name === 'name') {
      const slug = value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao criar categoria.')
      }

      setStatus({ loading: false, error: '', success: data.message })
      setFormData({
        name: '',
        slug: '',
        description: '',
        parent_id: '',
        is_active: true,
      })
      loadCategories()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  const handleDelete = async () => {
    if (!modal.item?.id) return

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${modal.item.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao excluir categoria.')
      }

      setModal({ open: false, item: null })
      loadCategories()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
      setModal({ open: false, item: null })
    }
  }

  const parentOptions = categories
    .filter(cat => !cat.parent_id)
    .map(cat => ({ value: cat.id, label: cat.name }))

  return (
    <div className="admin-categories">
      <FormCard
        title="Cadastrar Categoria"
        description="Crie categorias para organizar os produtos"
        onSubmit={handleSubmit}
        actionLabel="Cadastrar Categoria"
        disabled={status.loading}
      >
        <Input
          label="Nome da Categoria"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Ex: Uniformes"
          required
        />
        
        <Input
          label="Slug (URL amigável)"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          placeholder="uniformes"
          required
        />

        <Textarea
          label="Descrição (opcional)"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descreva a categoria..."
          rows={3}
          required={false}
        />

        <label className="field">
          <span>Categoria Pai (opcional)</span>
          <select
            name="parent_id"
            value={formData.parent_id}
            onChange={handleInputChange}
          >
            <option value="">Nenhuma (categoria principal)</option>
            {parentOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>

        <label className="field checkbox">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
          />
          <span>Categoria ativa</span>
        </label>

        {status.error && <Status type="error" message={status.error} />}
        {status.success && <Status type="success" message={status.success} />}
      </FormCard>

      <div className="categories-list">
        <h2>Categorias Cadastradas</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Slug</th>
                <th>Pai</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>{category.parent?.name || '-'}</td>
                  <td>
                    <span className={`status-badge ${category.is_active ? 'active' : 'inactive'}`}>
                      {category.is_active ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => setModal({ open: true, item: category })}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, item: null })}
        title="Confirmar Exclusão"
      >
        <p>Deseja realmente excluir a categoria "{modal.item?.name}"?</p>
        <div className="modal-actions">
          <button onClick={() => setModal({ open: false, item: null })}>
            Cancelar
          </button>
          <button className="delete" onClick={handleDelete}>
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default AdminCategories
