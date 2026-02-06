<?php

// Script para popular banco de dados com dados de teste
// Execute com: docker compose exec backend php populate_test_data.php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Subject;
use App\Models\Note;
use Illuminate\Support\Facades\Hash;

echo "=== Populando banco de dados com dados de teste ===\n\n";

// Criar matérias
echo "Criando matérias...\n";
$subjects = [
    'Matemática Aplicada',
    'Programação Avançada',
    'Banco de Dados',
    'Engenharia de Software',
    'Redes de Computadores',
    'Inteligência Artificial',
    'Sistemas Operacionais',
    'Estrutura de Dados',
    'Algoritmos Complexos',
    'Desenvolvimento Web'
];

$subjectModels = [];
foreach ($subjects as $name) {
    $subject = Subject::firstOrCreate(
        ['name' => $name],
        ['name' => $name]
    );
    $subjectModels[] = $subject;
    echo "  ✓ $name (ID: {$subject->id})\n";
}

// Criar usuários adicionais (além dos que já existem)
echo "\nCriando usuários de teste...\n";
$users = [
    ['name' => 'Carlos Silva', 'email' => 'carlos@teste.com'],
    ['name' => 'Ana Santos', 'email' => 'ana@teste.com'],
    ['name' => 'Pedro Costa', 'email' => 'pedro@teste.com'],
    ['name' => 'Maria Oliveira', 'email' => 'maria@teste.com'],
    ['name' => 'João Pereira', 'email' => 'joao@teste.com'],
    ['name' => 'Fernanda Lima', 'email' => 'fernanda@teste.com'],
    ['name' => 'Ricardo Alves', 'email' => 'ricardo@teste.com'],
    ['name' => 'Juliana Souza', 'email' => 'juliana@teste.com'],
];

$userModels = [];
foreach ($users as $userData) {
    $user = User::firstOrCreate(
        ['email' => $userData['email']],
        [
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => Hash::make('password123'),
            'is_admin' => false
        ]
    );
    $userModels[] = $user;
    echo "  ✓ {$userData['name']} (ID: {$user->id})\n";
}

// Adicionar usuários existentes
$existingUsers = User::whereIn('id', [1, 2, 3, 4, 5])->get();
foreach ($existingUsers as $user) {
    $userModels[] = $user;
}

echo "\nTotal de usuários: " . count($userModels) . "\n";

// Criar notas para cada usuário em várias matérias
echo "\nCriando notas...\n";
$totalNotes = 0;

foreach ($userModels as $user) {
    // Cada usuário terá notas em 60-80% das matérias
    $numSubjects = rand(6, 8);
    $selectedSubjects = collect($subjectModels)->random($numSubjects);
    
    foreach ($selectedSubjects as $subject) {
        // Cada matéria terá 2-4 notas
        $numNotes = rand(2, 4);
        
        for ($i = 0; $i < $numNotes; $i++) {
            // Gerar nota aleatória com tendência (alguns usuários são melhores)
            $baseScore = $user->id <= 3 ? 7.5 : 6.0; // Primeiros 3 usuários são melhores
            $randomVariation = (rand(-150, 150) / 100); // -1.5 a +1.5
            $score = max(0, min(10, $baseScore + $randomVariation));
            
            Note::create([
                'user_id' => $user->id,
                'subject_id' => $subject->id,
                'notice_id' => null,
                'score' => round($score, 2),
                'grade' => round($score, 2),
                'status' => 'approved'
            ]);
            $totalNotes++;
        }
    }
    
    echo "  ✓ {$user->name}: notas criadas\n";
}

echo "\n=== Resumo ===\n";
echo "Total de matérias: " . count($subjectModels) . "\n";
echo "Total de usuários: " . count($userModels) . "\n";
echo "Total de notas criadas: $totalNotes\n";
echo "\n✅ Banco de dados populado com sucesso!\n";
