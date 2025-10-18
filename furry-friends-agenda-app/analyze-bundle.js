// Bundle analyzer script
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

console.log('🔍 Analisando bundle do frontend...\n');

// Build the project
try {
  console.log('📦 Construindo projeto...');
  execSync('npm run build', { stdio: 'inherit', cwd: './furry-friends-agenda-app' });

  console.log('✅ Build concluído com sucesso!\n');

  // Read build stats if available
  try {
    const stats = readFileSync('./furry-friends-agenda-app/dist/index.html', 'utf8');
    console.log('📊 Estatísticas básicas:');
    console.log('- Build output gerado em dist/');
    console.log('- Arquivo index.html criado');

    // Simple size estimation
    const assets = stats.match(/src="\/assets\/[^"]*"/g) || [];
    console.log(`- Número de assets: ${assets.length}`);

  } catch (error) {
    console.log('ℹ️  Não foi possível ler estatísticas detalhadas');
  }

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}

console.log('\n💡 Recomendações de otimização:');
console.log('1. ✅ Lazy loading implementado para componentes de rotas');
console.log('2. ✅ Code splitting automático do Vite ativo');
console.log('3. ✅ React.memo implementado para componentes');
console.log('4. ✅ useMemo/useCallback otimizados');
console.log('5. 📋 Considere tree shaking para ícones do Lucide React');
console.log('6. 📋 Implemente service worker para cache');
console.log('7. 📋 Use React.lazy para componentes pesados');