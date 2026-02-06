import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import Select from '../../components/Select'
import Status from '../../components/Status'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './Shop.css'

const Shop = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category_id: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
  })
  const [status, setStatus] = useState({ loading: false, error: '' })
  const [pagination, setPagination] = useState(null)

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories?active_only=1`)
      const data = await parseJson(response)
      if (response.ok) {
        setCategories(data?.categories || [])
      }
    } catch {}
  }

  const loadProducts = async (page = 1) => {
    setStatus({ loading: true, error: '' })
    try {
      const params = new URLSearchParams({
        page,
        status: 'active',
        ...filters,
      })
      
      const response = await fetch(`${API_BASE_URL}/products?${params}`)
      const data = await parseJson(response)
      
      if (response.ok) {
        setProducts(data?.data || [])
        setPagination({
          current_page: data?.current_page,
          last_page: data?.last_page,
          total: data?.total,
        })
      } else {
        throw new Error(data?.message || 'Erro ao carregar produtos.')
      }
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setStatus({ loading: false, error: error.message })
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadProducts()
  }

  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ]

  const sortOptions = [
    { value: 'created_at-desc', label: 'Mais recentes' },
    { value: 'price-asc', label: 'Menor preço' },
    { value: 'price-desc', label: 'Maior preço' },
    { value: 'name-asc', label: 'Nome (A-Z)' },
  ]

  const handleSortChange = (e) => {
    const [sort_by, sort_order] = e.target.value.split('-')
    setFilters(prev => ({ ...prev, sort_by, sort_order }))
  }

  return (
    <div className="shop">
      <div className="shop-header">
        <h1>Loja de Equipamentos</h1>
        <p>Produtos para formação de soldados da PM-SP</p>
      </div>

      <div className="shop-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Buscar produtos..."
            value={filters.search}
            onChange={handleFilterChange}
          />
          <button type="submit" className="primary">Buscar</button>
        </form>

        <div className="filter-row">
          <Select
            label=""
            name="category_id"
            value={filters.category_id}
            onChange={handleFilterChange}
            options={categoryOptions}
            required={false}
          />

          <select
            value={`${filters.sort_by}-${filters.sort_order}`}
            onChange={handleSortChange}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {status.error && <Status type="error" message={status.error} />}
      {status.loading && <p>Carregando produtos...</p>}

      {!status.loading && products.length === 0 && (
        <div className="empty-state">
          <p>Nenhum produto encontrado.</p>
        </div>
      )}

      {!status.loading && products.length > 0 && (
        <>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/shop/products/${product.id}`)}
              />
            ))}
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="pagination">
              <button
                disabled={pagination.current_page === 1}
                onClick={() => loadProducts(pagination.current_page - 1)}
              >
                Anterior
              </button>
              <span>
                Página {pagination.current_page} de {pagination.last_page}
              </span>
              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => loadProducts(pagination.current_page + 1)}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Shop
