// Script de teste para console do navegador
// Cole no DevTools Console (F12) para testar

console.clear();
console.log('%c=== TESTE DE ROLES ===', 'color: blue; font-size: 16px; font-weight: bold');

// Função canAccess copiada do código
function canAccess(userRole, requiredRole) {
  if (!requiredRole) return true;
  if (userRole === 'admin') return true;
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

// Testes
const tests = [
  { user: 'student', required: ['vendor', 'admin'], expected: false },
  { user: 'vendor', required: ['vendor', 'admin'], expected: true },
  { user: 'admin', required: ['vendor', 'admin'], expected: true },
  { user: 'admin', required: 'admin', expected: true },
  { user: 'student', required: 'admin', expected: false },
  { user: 'vendor', required: 'admin', expected: false },
];

console.log('\nResultados:');
tests.forEach((test, i) => {
  const result = canAccess(test.user, test.required);
  const status = result === test.expected ? '✅' : '❌';
  const reqStr = Array.isArray(test.required) ? `[${test.required.join(', ')}]` : test.required;
  console.log(`${status} Teste ${i+1}: ${test.user} acessando ${reqStr} = ${result} (esperado: ${test.expected})`);
});

console.log('\n%c=== TESTE DE MENU DO SIDEBAR ===', 'color: green; font-size: 16px; font-weight: bold');

// Simular useRole
function useRole(user) {
  const role = user?.role || 'student';
  return {
    isAdmin: role === 'admin',
    isVendor: role === 'vendor',
    isStudent: role === 'student' || !user?.role,
    role
  };
}

const users = [
  { name: 'Student', role: 'student' },
  { name: 'Vendor', role: 'vendor' },
  { name: 'Admin', role: 'admin' }
];

users.forEach(user => {
  const { isAdmin, isVendor, isStudent } = useRole(user);
  console.log(`\n👤 ${user.name} (role: ${user.role}):`);
  console.log('  - Home, Materiais, Loja: ✅ (todos)');
  console.log(`  - Área Vendedor: ${(isVendor || isAdmin) ? '✅' : '❌'}`);
  console.log(`  - "Quero ser Vendedor": ${(isStudent && !isVendor) ? '✅' : '❌'}`);
  console.log(`  - Administração: ${isAdmin ? '✅' : '❌'}`);
});

console.log('\n%c=== INSTRUÇÕES ===', 'color: orange; font-size: 14px; font-weight: bold');
console.log('1. Para mudar seu role, cole um destes comandos:');
console.log('   localStorage.setItem("essd_user", JSON.stringify({id:1, name:"Test Student", email:"student@test.com", role:"student", token:"abc"}))');
console.log('   localStorage.setItem("essd_user", JSON.stringify({id:2, name:"Test Vendor", email:"vendor@test.com", role:"vendor", token:"abc"}))');
console.log('   localStorage.setItem("essd_user", JSON.stringify({id:3, name:"Test Admin", email:"admin@test.com", role:"admin", token:"abc"}))');
console.log('\n2. Depois recarregue a página (F5)');
console.log('\n3. Verifique o menu lateral (botão ☰)');
console.log('\n4. Tente acessar rotas protegidas:');
console.log('   - /vendor/products (vendor/admin)');
console.log('   - /admin/categories (admin)');
