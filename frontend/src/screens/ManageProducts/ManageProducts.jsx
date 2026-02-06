import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import ImageUploader from '../../components/ImageUploader'
import Select from '../../components/Select'
import Textarea from '../../components/Textarea'
import ProductCard from '../../components/ProductCard'
import Status from '../../components/Status'
import Modal from '../../components/Modal'
import { API_BASE_URL, parseJson, getAuthHeaders, getAuthHeadersMultipart } from '../../lib/api'
import './ManageProducts.css'

const ManageProducts = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ type: '', message: '' })
  
  const initialFormData = {
    name: '',
    slug: '',
    category_id: '',
    description: '',
    price: '',
    stock: '',
    sku: '',
    status: 'active',
  }
  
  const [formData, setFormData] = useState(initialFormData)
  const [images, setImages] = useState([])

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories?active_only=1`)
      const data = await parseJson(response)
      if (response.ok) {
        setCategories(data?.categories || [])
      }
    } catch {
      setCategories([])
    }
  }

  const loadProducts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const response = await fetch(`${API_BASE_URL}/products?vendor_id=${user.id}`, {
        headers: getAuthHeaders(),
      })
      const data = await parseJson(response)
      if (response.ok) {
        setProducts(data?.data || [])
      }
    } catch {
      setProducts([])
    }
  }

  useEffect(() => {
    loadCategories()
    loadProducts()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'price') {
      // Remove tudo exceto números
      let numbers = value.replace(/\D/g, '')
      
      // Se vazio, limpa o campo
      if (numbers === '') {
        setFormData(prev => ({ ...prev, [name]: '' }))
        return
      }
      
      // Converte para número e divide por 100 para ter centavos
      let amount = parseInt(numbers) / 100
      
      // Formata para o padrão brasileiro (123,45)
      let formatted = amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
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
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        // Converte preço formatado (123,45) para formato numérico (123.45)
        if (key === 'price' && formData[key]) {
          const numericPrice = formData[key].toString().replace(/\./g, '').replace(',', '.')
          data.append(key, numericPrice)
        } else if (formData[key]) {
          data.append(key, formData[key])
        }
      })
      images.forEach((image, index) => {
        data.append(`images[${index}]`, image)
      })

      console.log('URL da API:', API_BASE_URL)
      console.log('Dados enviados:', Object.fromEntries(data))

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeadersMultipart(),
        body: data,
      }).catch(fetchError => {
        console.error('Erro na requisição fetch:', fetchError)
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
      })

      const result = await parseJson(response)

      console.log('Status da resposta:', response.status)
      console.log('Resposta do servidor:', result)

      if (!response.ok) {
        const errorMsg = result?.errors ? Object.values(result.errors).flat().join(' ') : (result?.message || 'Erro ao cadastrar produto.')
        throw new Error(errorMsg)
      }

      setStatus({ loading: false, error: '', success: '' })
      setModalContent({ type: 'success', message: result.message || 'Produto cadastrado com sucesso!' })
      setShowModal(true)
      
      // Limpar formulário e imagens
      setFormData(initialFormData)
      setImages([])
      
      // Recarregar produtos
      setTimeout(() => loadProducts(), 500)
    } catch (error) {
      console.error('Erro completo:', error)
      setStatus({ loading: false, error: '', success: '' })
      setModalContent({ 
        type: 'error', 
        message: error.message || 'Erro desconhecido ao cadastrar produto'
      })
      setShowModal(true)
    }
  }

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))

  const statusOptions = [
    { value: 'draft', label: 'Rascunho' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
  ]

  return (
    <div className="manage-products">
      <FormCard
        title="Cadastrar Produto"
        description="Adicione um novo produto ao seu catálogo"
        onSubmit={handleSubmit}
        actionLabel="Cadastrar Produto"
        disabled={status.loading}
      >
        <Input
          label="Nome do Produto"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Ex: Coturno Militar"
          required
        />
        
        <Input
          label="Slug (URL amigável)"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          placeholder="coturno-militar"
          required
        />

        <Select
          label="Categoria"
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          options={categoryOptions}
          required
        />

        <Textarea
          label="Descrição"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descreva o produto..."
          rows={5}
          required
        />

        <div className="form-row">
          <Input
            label="Preço (R$)"
            name="price"
            type="text"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Ex: 199.90"
            required
          />

          <Input
            label="Estoque"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="0"
            required
          />
        </div>

        <div className="form-row">
          <Input
            label="SKU (Opcional)"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            placeholder="SKU-001"
            required={false}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={statusOptions}
            required
          />
        </div>

        <ImageUploader images={images} setImages={setImages} maxImages={5} />

        {status.error && <Status type="error" message={status.error} />}
        {status.success && <Status type="success" message={status.success} />}
      </FormCard>

      <div className="products-list">
        <h2>Meus Produtos</h2>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/manage-products/${product.id}`)}
            />
          ))}
        </div>
        {products.length === 0 && (
          <p className="empty-state">Nenhum produto cadastrado ainda.</p>
        )}
      </div>

      <Modal
        isOpen={showModal}
        title={modalContent.type === 'success' ? '✅ Sucesso' : '❌ Erro'}
        onClose={() => setShowModal(false)}
      >
        <p style={{ textAlign: 'center', fontSize: '1rem' }}>{modalContent.message}</p>
      </Modal>
    </div>
  )
}

export default ManageProducts
