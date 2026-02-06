# Módulo E-Shop - Instruções de Instalação e Uso

## 📋 O que foi implementado

Um marketplace completo para venda de produtos relacionados ao curso de formação de soldados da PM-SP, incluindo:

### Backend (Laravel)
- ✅ Sistema de roles (student, vendor, admin)
- ✅ Middleware de autorização por role
- ✅ 9 migrations criadas (vendors, categories, products, product_images, cart_items, orders, order_items, product_reviews)
- ✅ 8 Models com relacionamentos completos
- ✅ 9 FormRequests para validação
- ✅ 6 Controllers RESTful (VendorController, CategoryController, ProductController, CartController, OrderController, ProductReviewController)
- ✅ Rotas API protegidas e organizadas por role
- ✅ Policy para produtos (ProductPolicy)

### Frontend (React)
- ✅ Componentes reutilizáveis (Select, Textarea, ProductCard, ImageUploader, Modal)
- ✅ Telas para vendedores:
  - ManageProducts - CRUD de produtos
  - VendorRegistration - Cadastro/edição de perfil de vendedor
  - VendorOrders - Gestão de pedidos recebidos
- ✅ Telas para clientes:
  - Shop - Catálogo de produtos com filtros
  - ProductDetail - Detalhes do produto
  - Cart - Carrinho de compras
  - Checkout - Finalização de pedido
- ✅ Telas administrativas:
  - AdminCategories - Gestão de categorias
  - AdminVendors - Aprovação/rejeição de vendedores

## 🚀 Como executar

### 1. Iniciar o ambiente Docker
```bash
cd /home/allan/Desktop/projeto_essd_full
docker-compose up -d
```

### 2. Executar as migrations (dentro do container do backend)
```bash
docker-compose exec backend php artisan migrate
```

### 3. (Opcional) Criar categorias iniciais
Entre no container e execute no Tinker:
```bash
docker-compose exec backend php artisan tinker
```

Depois execute:
```php
use App\Models\Category;

Category::create(['name' => 'Uniformes', 'slug' => 'uniformes', 'is_active' => true]);
Category::create(['name' => 'Calçados', 'slug' => 'calcados', 'is_active' => true]);
Category::create(['name' => 'Equipamentos', 'slug' => 'equipamentos', 'is_active' => true]);
Category::create(['name' => 'Acessórios', 'slug' => 'acessorios', 'is_active' => true]);
```

### 4. Criar um usuário admin (Opcional)
Ainda no Tinker:
```php
use App\Models\User;

$admin = User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'role' => 'admin'
]);
```

## 📱 Funcionalidades por Role

### Student (Aluno)
- Navegar no catálogo de produtos
- Ver detalhes de produtos
- Adicionar produtos ao carrinho
- Finalizar compra
- Ver histórico de pedidos
- Avaliar produtos comprados

### Vendor (Vendedor)
- Cadastrar perfil de vendedor (aguarda aprovação admin)
- Gerenciar produtos (criar, editar, excluir)
- Upload de múltiplas imagens por produto
- Gerenciar estoque e preços
- Ver pedidos de seus produtos
- Atualizar status de pedidos

### Admin (Administrador)
- Aprovar/rejeitar cadastros de vendedores
- Gerenciar categorias de produtos
- Moderar produtos
- Visão geral de pedidos
- Acesso completo ao sistema

## 🔗 Rotas API Principais

### Públicas
- `GET /api/categories` - Listar categorias
- `GET /api/products` - Listar produtos
- `GET /api/products/{id}` - Detalhes do produto
- `GET /api/reviews` - Listar avaliações

### Autenticadas
- `POST /api/vendors` - Cadastrar como vendedor
- `GET /api/vendors/me` - Meu perfil de vendedor
- `GET /api/cart` - Ver carrinho
- `POST /api/cart` - Adicionar ao carrinho
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Meus pedidos

### Vendor/Admin
- `POST /api/products` - Criar produto
- `PATCH /api/products/{id}` - Atualizar produto
- `DELETE /api/products/{id}` - Excluir produto
- `GET /api/vendor/orders` - Pedidos do vendedor

### Admin Only
- `GET /api/vendors` - Listar vendedores
- `PATCH /api/vendors/{id}` - Aprovar/rejeitar vendedor
- `POST /api/categories` - Criar categoria
- `PATCH /api/categories/{id}` - Atualizar categoria

## 🎨 Próximos Passos (Sugestões)

1. **Integração de Pagamento**
   - Implementar PagSeguro, Mercado Pago ou Stripe
   - Webhook para confirmação de pagamento

2. **Cálculo de Frete**
   - Integrar API dos Correios
   - Tabela de frete por região

3. **Notificações**
   - Email quando pedido for criado
   - Email quando vendedor for aprovado
   - Notificações in-app

4. **Dashboard de Estatísticas**
   - Gráficos de vendas para vendedores
   - Estatísticas gerais para admin

5. **Sistema de Cupons**
   - Descontos e promoções
   - Cupons por categoria ou vendedor

6. **Chat entre Cliente e Vendedor**
   - Sistema de mensagens

7. **Wishlist**
   - Lista de produtos favoritos

## 📂 Estrutura de Arquivos Criados

### Backend
```
backend/app/
├── database/migrations/
│   ├── 2026_02_06_000001_add_role_to_users_table.php
│   ├── 2026_02_06_000002_create_vendors_table.php
│   ├── 2026_02_06_000003_create_categories_table.php
│   ├── 2026_02_06_000004_create_products_table.php
│   ├── 2026_02_06_000005_create_product_images_table.php
│   ├── 2026_02_06_000006_create_cart_items_table.php
│   ├── 2026_02_06_000007_create_orders_table.php
│   ├── 2026_02_06_000008_create_order_items_table.php
│   └── 2026_02_06_000009_create_product_reviews_table.php
├── app/Models/
│   ├── Vendor.php
│   ├── Category.php
│   ├── Product.php
│   ├── ProductImage.php
│   ├── CartItem.php
│   ├── Order.php
│   ├── OrderItem.php
│   └── ProductReview.php
├── app/Http/Controllers/Api/
│   ├── VendorController.php
│   ├── CategoryController.php
│   ├── ProductController.php
│   ├── CartController.php
│   ├── OrderController.php
│   └── ProductReviewController.php
├── app/Http/Requests/
│   ├── VendorStoreRequest.php
│   ├── VendorUpdateRequest.php
│   ├── CategoryStoreRequest.php
│   ├── CategoryUpdateRequest.php
│   ├── ProductStoreRequest.php
│   ├── ProductUpdateRequest.php
│   ├── CartItemStoreRequest.php
│   ├── OrderStoreRequest.php
│   └── ProductReviewStoreRequest.php
├── app/Http/Middleware/
│   └── CheckRole.php
└── app/Policies/
    └── ProductPolicy.php
```

### Frontend
```
frontend/src/
├── components/
│   ├── Select.jsx
│   ├── Textarea.jsx
│   ├── ProductCard.jsx (+ .css)
│   ├── ImageUploader.jsx (+ .css)
│   └── Modal.jsx
└── screens/
    ├── ManageProducts/ (+ .css)
    ├── VendorRegistration/ (+ .css)
    ├── VendorOrders/ (+ .css)
    ├── Shop/ (+ .css)
    ├── ProductDetail/ (+ .css)
    ├── Cart/ (+ .css)
    ├── Checkout/ (+ .css)
    ├── AdminCategories/ (+ .css)
    └── AdminVendors/ (+ .css)
```

## ⚠️ Observações Importantes

1. As rotas no frontend ainda precisam ser registradas no arquivo de rotas do React Router
2. Links no menu/navbar precisam ser adicionados para as novas telas
3. O campo `role` foi adicionado ao User model - usuários existentes terão role 'student' por padrão
4. Upload de arquivos usa o storage público - certifique-se de criar o link simbólico:
   ```bash
   docker-compose exec backend php artisan storage:link
   ```
5. As cores CSS usam variáveis - certifique-se que o tema atual suporta as variáveis usadas

## 🐛 Troubleshooting

**Problema**: Erro ao fazer upload de imagens
**Solução**: Execute `php artisan storage:link` no container

**Problema**: Produtos não aparecem na loja
**Solução**: Verifique se o produto está com status 'active' e tem estoque > 0

**Problema**: Vendedor não consegue criar produtos
**Solução**: Verifique se o vendedor foi aprovado (status 'approved')

**Problema**: Erro 403 ao acessar rotas
**Solução**: Verifique o role do usuário logado e as permissões da rota
