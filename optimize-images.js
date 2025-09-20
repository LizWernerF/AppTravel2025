// Script para otimizar imagens do AppTravel
// Execute com: node optimize-images.js

const fs = require('fs');
const path = require('path');

// Configurações de otimização
const OPTIMIZATION_SETTINGS = {
  // Redimensionar para mobile-first
  maxWidth: 800,
  maxHeight: 600,
  
  // Qualidade de compressão
  jpegQuality: 85,
  pngQuality: 90,
  
  // Formatos preferenciais
  preferWebP: true,
  
  // Pasta de destino
  outputDir: './Images-optimized/'
};

// Lista de imagens para otimizar
const IMAGES_TO_OPTIMIZE = [
  // Roma (prioridade alta - muitas imagens)
  'ROMA_Coliseu.jpg', 'ROMA_ForumRomano.jpg', 'ROMA_MontePalatino.jpg',
  'ROMA_Panteão.jpg', 'ROMA_BasilicadeSaoPedro.png', 'ROMA_CastelSantAngelo.jpg',
  'ROMA_catacumbas.png', 'ROMA_Circomaximo.png', 'ROMA_EscadariadaPraçadeEspanha.png',
  'ROMA_FontanadiTrevi.png', 'ROMA_MuseusCapitolinos.jpg', 'ROMA_MuseusdoVaticano.jpg',
  'ROMA_PalazzoBarberini.jpg', 'ROMA_PiazzaNavona.png', 'ROMA_TermasdeCaracalla.jpg',
  'ROMA_ViaApia.png', 'ROMA.jpg',
  
  // Florença
  'FLORENCA_Duomo.jpeg', 'FLORENCA_Galleria degli Uffizi.jpg', 'FLORENCA_Ponte.jpg',
  'FLORENCA_BasilicaDeSanLorenzo.png', 'FLORENCA_BasilicaDeSantaCroce.png',
  'FLORENCA_GalleriaDellAcademia.png', 'FLORENCA_PalazzoPitti.png',
  'FLORENCA_PalazzoVecchio.png', 'FLORENCA_PiazzaleMichelangelo.png',
  'FLORENCA_PiazzaSangiovanni.png', 'FLORENCA.jpg',
  
  // Milão
  'MILAO_castelo.jpg', 'MILAO_duomo.jpg', 'MILAO_galeria.png',
  'MILAO_teatro.png', 'MILAO_ultimaceia.png', 'MILAO.jpg',
  
  // Pisa
  'PISA_batisterio.png', 'PISA_catedral.jpeg', 'PISA_torre.jpeg', 'PISA.jpg',
  
  // San Gimignano
  'SANGEMINIANO_duomo.png', 'SANGEMINIANO_PalazzoComunale.png',
  'SANGEMINIANO_piazza.png', 'SANGEMINIANO_torre.png', 'SANGEMINIANO.png',
  
  // Siena
  'SIENA_catedral.jpg', 'SIENA_piazza.jpg', 'SIENA_torre.jpg', 'SIENA.jpeg',
  
  // Outros
  'ITALIA.png', 'googlemaps.png'
];

function createOptimizationInstructions() {
  const instructions = `
# 🚀 Guia de Otimização de Imagens - AppTravel

## 📋 Instruções Passo a Passo:

### 1. **Ferramentas Recomendadas:**
- **Online:** [Squoosh.app](https://squoosh.app) (Google) - GRATUITO
- **Online:** [TinyPNG](https://tinypng.com) - GRATUITO
- **Desktop:** [ImageOptim](https://imageoptim.com) (Mac)
- **Desktop:** [RIOT](http://luci.criosweb.ro/riot/) (Windows)

### 2. **Configurações de Otimização:**

#### **Para JPG/JPEG:**
- **Qualidade:** 80-85%
- **Redimensionar:** Máximo 800px de largura
- **Progressive:** Sim (carregamento progressivo)

#### **Para PNG:**
- **Compressão:** Máxima
- **Redimensionar:** Máximo 800px de largura
- **Remover metadados:** Sim

#### **Para WebP (Recomendado):**
- **Qualidade:** 80%
- **Redimensionar:** Máximo 800px de largura
- **Lossless:** Não (use lossy para melhor compressão)

### 3. **Prioridades de Otimização:**

#### **🔥 ALTA PRIORIDADE (Carregam primeiro):**
${IMAGES_TO_OPTIMIZE.slice(0, 10).map(img => `- ${img}`).join('\n')}

#### **⚡ MÉDIA PRIORIDADE:**
${IMAGES_TO_OPTIMIZE.slice(10, 20).map(img => `- ${img}`).join('\n')}

#### **📱 BAIXA PRIORIDADE (Carregam depois):**
${IMAGES_TO_OPTIMIZE.slice(20).map(img => `- ${img}`).join('\n')}

### 4. **Resultados Esperados:**
- **Redução de tamanho:** 60-80%
- **Tempo de carregamento:** 3-5x mais rápido
- **Economia de dados:** Ideal para mobile

### 5. **Como Aplicar:**
1. Abra [Squoosh.app](https://squoosh.app)
2. Arraste uma imagem
3. Configure: Qualidade 80%, Largura 800px
4. Baixe a versão otimizada
5. Substitua o arquivo original

### 6. **Teste de Performance:**
- Use o arquivo \`optimize-images.html\` para ver o antes/depois
- Teste no mobile com conexão lenta
- Verifique o tempo de carregamento

## 🎯 **Meta de Otimização:**
- **Tamanho total atual:** ~50-100MB
- **Tamanho otimizado:** ~10-20MB
- **Economia:** 70-80%

## 📱 **Benefícios Mobile:**
- Carregamento 3x mais rápido
- Menos uso de dados
- Melhor experiência do usuário
- Menos travamentos

---
*Execute este script para gerar instruções personalizadas para seu projeto.*
`;

  fs.writeFileSync('./OTIMIZACAO-IMAGENS.md', instructions);
  console.log('✅ Arquivo OTIMIZACAO-IMAGENS.md criado!');
  console.log('📖 Leia as instruções detalhadas no arquivo gerado.');
}

function analyzeCurrentImages() {
  const imagesDir = './Images/';
  let totalSize = 0;
  let imageCount = 0;
  
  console.log('🔍 Analisando imagens atuais...\n');
  
  IMAGES_TO_OPTIMIZE.forEach(imageName => {
    const imagePath = path.join(imagesDir, imageName);
    
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      const sizeKB = Math.round(stats.size / 1024);
      totalSize += stats.size;
      imageCount++;
      
      console.log(`📸 ${imageName}: ${sizeKB}KB`);
    } else {
      console.log(`❌ ${imageName}: Arquivo não encontrado`);
    }
  });
  
  const totalSizeMB = Math.round(totalSize / (1024 * 1024) * 100) / 100;
  const estimatedOptimizedMB = Math.round(totalSizeMB * 0.3 * 100) / 100;
  const savings = Math.round((1 - 0.3) * 100);
  
  console.log('\n📊 RESUMO:');
  console.log(`📁 Total de imagens: ${imageCount}`);
  console.log(`💾 Tamanho atual: ${totalSizeMB}MB`);
  console.log(`🎯 Tamanho otimizado (estimado): ${estimatedOptimizedMB}MB`);
  console.log(`💰 Economia: ${savings}% (${Math.round((totalSizeMB - estimatedOptimizedMB) * 100) / 100}MB)`);
  console.log(`⚡ Velocidade: ${Math.round(100/savings * 100) / 100}x mais rápido`);
}

// Executar análise
console.log('🚀 AppTravel - Otimizador de Imagens\n');
createOptimizationInstructions();
analyzeCurrentImages();

console.log('\n✅ Análise concluída!');
console.log('📖 Consulte OTIMIZACAO-IMAGENS.md para instruções detalhadas.');
console.log('🌐 Use optimize-images.html para testar as otimizações.');
