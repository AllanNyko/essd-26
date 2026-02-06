<?php

// Script para popular banco de dados com dados de teste do E-Shop
// Execute com: docker compose exec backend php populate_eshop_data.php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Vendor;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductReview;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

echo "=== Populando banco de dados com dados de teste do E-Shop ===\n\n";

try {
    DB::beginTransaction();

    // 1. Criar usuários vendedores e clientes
    echo "1. Criando usuários...\n";
    
    // Admin já existe (admin@exemplo.com)
    $admin = User::where('email', 'admin@exemplo.com')->first();
    if (!$admin) {
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@exemplo.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);
        echo "  ✓ Admin criado\n";
    } else {
        echo "  ✓ Admin já existe\n";
    }

    // Criar vendedores
    $vendorUsers = [
        [
            'name' => 'João Silva',
            'email' => 'joao.vendedor@teste.com',
            'company' => 'Equipamentos Táticos Silva',
            'cnpj' => '12.345.678/0001-90',
            'phone' => '(11) 98765-4321',
            'description' => 'Especializada em uniformes e equipamentos táticos para forças de segurança.',
        ],
        [
            'name' => 'Maria Santos',
            'email' => 'maria.vendedor@teste.com',
            'company' => 'Material Tático Premium',
            'cnpj' => '23.456.789/0001-12',
            'phone' => '(11) 97654-3210',
            'description' => 'Fornecedor oficial de calçados e acessórios profissionais.',
        ],
        [
            'name' => 'Carlos Oliveira',
            'email' => 'carlos.vendedor@teste.com',
            'company' => 'Tático Store',
            'cnpj' => '34.567.890/0001-34',
            'phone' => '(11) 96543-2109',
            'description' => 'Materiais didáticos e equipamentos de treinamento de alta qualidade.',
        ],
    ];

    $vendors = [];
    foreach ($vendorUsers as $vendorData) {
        $user = User::firstOrCreate(
            ['email' => $vendorData['email']],
            [
                'name' => $vendorData['name'],
                'email' => $vendorData['email'],
                'password' => Hash::make('senha123'),
                'role' => 'vendor',
            ]
        );
        
        $vendor = Vendor::firstOrCreate(
            ['user_id' => $user->id],
            [
                'user_id' => $user->id,
                'company_name' => $vendorData['company'],
                'cnpj' => $vendorData['cnpj'],
                'description' => $vendorData['description'],
                'phone' => $vendorData['phone'],
                'status' => 'approved',
            ]
        );
        
        $vendors[] = $vendor;
        echo "  ✓ Vendedor: {$vendorData['company']}\n";
    }

    // Criar clientes (estudantes)
    $studentUsers = [
        ['name' => 'Pedro Almeida', 'email' => 'pedro.aluno@teste.com'],
        ['name' => 'Ana Costa', 'email' => 'ana.aluno@teste.com'],
        ['name' => 'Lucas Ferreira', 'email' => 'lucas.aluno@teste.com'],
        ['name' => 'Juliana Rocha', 'email' => 'juliana.aluno@teste.com'],
        ['name' => 'Ricardo Martins', 'email' => 'ricardo.aluno@teste.com'],
    ];

    $students = [];
    foreach ($studentUsers as $studentData) {
        $user = User::firstOrCreate(
            ['email' => $studentData['email']],
            [
                'name' => $studentData['name'],
                'email' => $studentData['email'],
                'password' => Hash::make('senha123'),
                'role' => 'student',
            ]
        );
        $students[] = $user;
        echo "  ✓ Estudante: {$studentData['name']}\n";
    }

    // 2. Verificar categorias (já foram criadas na migration)
    echo "\n2. Verificando categorias...\n";
    $categories = Category::all();
    if ($categories->isEmpty()) {
        $categoriesData = [
            ['name' => 'Uniformes', 'description' => 'Uniformes operacionais e de gala'],
            ['name' => 'Calçados', 'description' => 'Calçados táticos e botas'],
            ['name' => 'Equipamentos', 'description' => 'Equipamentos de proteção e tático'],
            ['name' => 'Acessórios', 'description' => 'Acessórios e complementos'],
            ['name' => 'Material Didático', 'description' => 'Livros, apostilas e materiais de estudo'],
        ];
        
        foreach ($categoriesData as $catData) {
            $cat = Category::create($catData);
            $categories->push($cat);
            echo "  ✓ Categoria criada: {$catData['name']}\n";
        }
    } else {
        echo "  ✓ " . $categories->count() . " categorias já existem\n";
    }

    // 3. Criar produtos variados
    echo "\n3. Criando produtos...\n";
    
    $productsData = [
        // Uniformes
        [
            'vendor_id' => $vendors[0]->user_id,
            'category_id' => $categories->where('name', 'Uniformes')->first()->id,
            'name' => 'Camisa Tática Operacional',
            'description' => 'Camisa tática de alto desempenho, confeccionada em tecido ripstop resistente. Ideal para operações de campo e treinamentos intensivos. Possui bolsos estratégicos e reforços nos cotovelos.',
            'price' => 189.90,
            'stock' => 45,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[0]->user_id,
            'category_id' => $categories->where('name', 'Uniformes')->first()->id,
            'name' => 'Calça Tática Cargo',
            'description' => 'Calça tática cargo com múltiplos bolsos. Tecido resistente e confortável, ideal para uso profissional. Ajuste na cintura e reforços nas áreas de maior desgaste.',
            'price' => 249.90,
            'stock' => 38,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[0]->user_id,
            'category_id' => $categories->where('name', 'Uniformes')->first()->id,
            'name' => 'Colete Tático Modular',
            'description' => 'Colete tático modular com sistema MOLLE para fixação de acessórios. Ajustável, ergonômico e fabricado com materiais de alta qualidade. Ideal para treinamentos e operações.',
            'price' => 459.90,
            'stock' => 22,
            'status' => 'active',
        ],

        // Calçados
        [
            'vendor_id' => $vendors[1]->user_id,
            'category_id' => $categories->where('name', 'Calçados')->first()->id,
            'name' => 'Bota Tática Cano Alto',
            'description' => 'Bota tática profissional de cano alto. Solado antiderrapante, resistente à água e com tecnologia de absorção de impacto. Perfeita para longas jornadas.',
            'price' => 349.90,
            'stock' => 30,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[1]->user_id,
            'category_id' => $categories->where('name', 'Calçados')->first()->id,
            'name' => 'Coturno Operacional',
            'description' => 'Coturno operacional de alta resistência. Confeccionado em couro legítimo com palmilha anatômica. Ideal para uso diário em serviço.',
            'price' => 289.90,
            'stock' => 42,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[1]->user_id,
            'category_id' => $categories->where('name', 'Calçados')->first()->id,
            'name' => 'Tênis Tático Leve',
            'description' => 'Tênis tático leve e confortável para operações rápidas. Tecnologia de ventilação e amortecimento superior. Ideal para treinamentos físicos.',
            'price' => 219.90,
            'stock' => 55,
            'status' => 'active',
        ],

        // Equipamentos
        [
            'vendor_id' => $vendors[0]->user_id,
            'category_id' => $categories->where('name', 'Equipamentos')->first()->id,
            'name' => 'Lanterna Tática LED 1200 Lumens',
            'description' => 'Lanterna tática profissional de alta potência com 1200 lumens. Resistente à água (IPX8), com 5 modos de iluminação e construção em alumínio aeronáutico.',
            'price' => 179.90,
            'stock' => 68,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[0]->user_id,
            'category_id' => $categories->where('name', 'Equipamentos')->first()->id,
            'name' => 'Mochila Tática 40L',
            'description' => 'Mochila tática de 40 litros com sistema MOLLE. Compartimentos organizadores, alças acolchoadas e capa de chuva incluída. Material impermeável.',
            'price' => 329.90,
            'stock' => 25,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[1]->user_id,
            'category_id' => $categories->where('name', 'Equipamentos')->first()->id,
            'name' => 'Joelheira e Cotoveleira Tática',
            'description' => 'Kit de proteção com joelheiras e cotoveleiras táticas. Material resistente a impactos, ajuste com velcro e alta durabilidade.',
            'price' => 129.90,
            'stock' => 47,
            'status' => 'active',
        ],

        // Acessórios
        [
            'vendor_id' => $vendors[1]->user_id,
            'category_id' => $categories->where('name', 'Acessórios')->first()->id,
            'name' => 'Cinto Tático Reforçado',
            'description' => 'Cinto tático reforçado de nylon balístico. Fivela de engate rápido e largura de 50mm. Suporta até 150kg de carga.',
            'price' => 89.90,
            'stock' => 73,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[1]->user_id,
            'category_id' => $categories->where('name', 'Acessórios')->first()->id,
            'name' => 'Luvas Táticas Antiderrapante',
            'description' => 'Luvas táticas com palma antiderrapante e dedos touch screen. Proteção reforçada nos nós dos dedos e respirabilidade superior.',
            'price' => 79.90,
            'stock' => 85,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[0]->user_id,
            'category_id' => $categories->where('name', 'Acessórios')->first()->id,
            'name' => 'Óculos Tático Balístico',
            'description' => 'Óculos de proteção balística com lentes intercambiáveis (clara, fumê e amarela). Proteção UV400 e resistente a impactos.',
            'price' => 149.90,
            'stock' => 52,
            'status' => 'active',
        ],

        // Material Didático
        [
            'vendor_id' => $vendors[2]->user_id,
            'category_id' => $categories->where('name', 'Material Didático')->first()->id,
            'name' => 'Apostila Completa PM-SP 2026',
            'description' => 'Apostila completa e atualizada para o concurso da Polícia Militar de São Paulo 2026. Mais de 1000 páginas de conteúdo, exercícios e simulados.',
            'price' => 129.90,
            'stock' => 150,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[2]->user_id,
            'category_id' => $categories->where('name', 'Material Didático')->first()->id,
            'name' => 'Manual de Abordagem Policial',
            'description' => 'Manual técnico de procedimentos de abordagem policial. Ilustrado, com casos práticos e fundamentação legal. Essencial para treinamento.',
            'price' => 89.90,
            'stock' => 95,
            'status' => 'active',
        ],
        [
            'vendor_id' => $vendors[2]->user_id,
            'category_id' => $categories->where('name', 'Material Didático')->first()->id,
            'name' => 'Kit Flashcards Legislação',
            'description' => 'Kit com 500 flashcards de legislação para estudo. Código Penal, Processo Penal, Constituição e leis especiais. Método comprovado de memorização.',
            'price' => 69.90,
            'stock' => 120,
            'status' => 'active',
        ],
    ];

    $products = [];
    foreach ($productsData as $prodData) {
        $product = Product::create($prodData);
        $products[] = $product;
        echo "  ✓ Produto: {$prodData['name']} (R$ {$prodData['price']})\n";
    }

    // 4. Criar imagens fictícias para produtos (URLs de placeholder)
    echo "\n4. Criando imagens de produtos...\n";
    $imageCount = 0;
    foreach ($products as $index => $product) {
        // Cada produto terá de 1 a 3 imagens
        $numImages = rand(1, 3);
        for ($i = 0; $i < $numImages; $i++) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => "products/placeholder-{$index}-{$i}.jpg",
                'is_primary' => $i === 0,
            ]);
            $imageCount++;
        }
    }
    echo "  ✓ $imageCount imagens criadas\n";

    // 5. Criar alguns itens no carrinho
    echo "\n5. Criando itens no carrinho...\n";
    $cartCount = 0;
    // Alguns estudantes têm produtos no carrinho
    foreach (array_slice($students, 0, 3) as $student) {
        $numItems = rand(1, 4);
        $selectedProducts = collect($products)->random(min($numItems, count($products)));
        
        foreach ($selectedProducts as $product) {
            CartItem::create([
                'user_id' => $student->id,
                'product_id' => $product->id,
                'quantity' => rand(1, 3),
            ]);
            $cartCount++;
        }
    }
    echo "  ✓ $cartCount itens adicionados aos carrinhos\n";

    // 6. Criar pedidos com diferentes status
    echo "\n6. Criando pedidos...\n";
    $orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    $orderCount = 0;

    foreach ($students as $student) {
        // Cada estudante fez de 1 a 3 pedidos
        $numOrders = rand(1, 3);
        
        for ($i = 0; $i < $numOrders; $i++) {
            // Selecionar produtos aleatórios
            $numItems = rand(1, 4);
            $selectedProducts = collect($products)->random(min($numItems, count($products)));
            
            $total = 0;
            $orderItems = [];
            
            foreach ($selectedProducts as $product) {
                $quantity = rand(1, 2);
                $total += $product->price * $quantity;
                
                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                ];
            }
            
            $order = Order::create([
                'user_id' => $student->id,
                'status' => $orderStatuses[array_rand($orderStatuses)],
                'subtotal' => $total,
                'shipping_cost' => 0,
                'total' => $total,
                'shipping_name' => $student->name,
                'shipping_phone' => '(11) ' . rand(90000, 99999) . '-' . rand(1000, 9999),
                'shipping_address' => "Rua Exemplo, " . rand(100, 999) . "\nBairro Teste\nSão Paulo - SP\nCEP " . rand(10000, 99999) . "-" . rand(100, 999),
                'shipping_city' => 'São Paulo',
                'shipping_state' => 'SP',
                'shipping_zip_code' => rand(10000, 99999) . '-' . rand(100, 999),
                'payment_method' => ['credit_card', 'credit_card', 'pix', 'boleto'][array_rand(['credit_card', 'credit_card', 'pix', 'boleto'])],
            ]);
            
            foreach ($orderItems as $itemData) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemData['product_id'],
                    'quantity' => $itemData['quantity'],
                ]);
            }
            
            $orderCount++;
        }
    }
    echo "  ✓ $orderCount pedidos criados\n";

    // 7. Criar avaliações de produtos
    echo "\n7. Criando avaliações de produtos...\n";
    $reviewCount = 0;
    
    // Apenas produtos de pedidos entregues podem ser avaliados
    $deliveredOrders = Order::where('status', 'delivered')->with('items.product')->get();
    
    foreach ($deliveredOrders as $order) {
        // 50% de chance de avaliar cada produto
        foreach ($order->items as $orderItem) {
            if (rand(0, 1) === 1) {
                $rating = rand(3, 5); // Avaliações geralmente positivas
                $comments = [
                    'Produto de excelente qualidade!',
                    'Muito bom, recomendo!',
                    'Atendeu às expectativas.',
                    'Material resistente e durável.',
                    'Ótimo custo-benefício.',
                    'Entrega rápida e produto conforme descrito.',
                    'Perfeito para treinamento.',
                    'Superou minhas expectativas!',
                ];
                
                ProductReview::create([
                    'product_id' => $orderItem->product_id,
                    'user_id' => $order->user_id,
                    'rating' => $rating,
                    'comment' => $comments[array_rand($comments)],
                    'is_verified_purchase' => true,
                ]);
                $reviewCount++;
            }
        }
    }
    echo "  ✓ $reviewCount avaliações criadas\n";

    DB::commit();

    // Estatísticas finais
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "✅ POPULAÇÃO DE DADOS CONCLUÍDA COM SUCESSO!\n";
    echo str_repeat("=", 60) . "\n\n";
    
    echo "📊 RESUMO:\n";
    echo "  • Usuários Admin: 1\n";
    echo "  • Vendedores: " . count($vendors) . "\n";
    echo "  • Estudantes: " . count($students) . "\n";
    echo "  • Categorias: " . $categories->count() . "\n";
    echo "  • Produtos: " . count($products) . "\n";
    echo "  • Imagens: $imageCount\n";
    echo "  • Itens no carrinho: $cartCount\n";
    echo "  • Pedidos: $orderCount\n";
    echo "  • Avaliações: $reviewCount\n\n";
    
    echo "🔑 CREDENCIAIS DE ACESSO:\n";
    echo "  Admin:     admin@exemplo.com / admin123\n";
    echo "  Vendedor:  joao.vendedor@teste.com / senha123\n";
    echo "  Vendedor:  maria.vendedor@teste.com / senha123\n";
    echo "  Vendedor:  carlos.vendedor@teste.com / senha123\n";
    echo "  Estudante: pedro.aluno@teste.com / senha123\n";
    echo "  Estudante: ana.aluno@teste.com / senha123\n\n";
    
    echo "🌐 ACESSE:\n";
    echo "  Frontend: http://localhost:3000\n";
    echo "  Loja: http://localhost:3000/shop\n\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\n❌ ERRO: " . $e->getMessage() . "\n";
    echo "Arquivo: " . $e->getFile() . "\n";
    echo "Linha: " . $e->getLine() . "\n";
    echo "\nStack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
