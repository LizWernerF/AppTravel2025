#!/bin/bash
# Script de build para site estático
echo "🏛️ AppTravel - Site Estático"
echo "📁 Verificando estrutura de pastas..."

# Verificar se as pastas existem
if [ -d "public/Audio" ]; then
    echo "✅ Pasta Audio encontrada"
else
    echo "❌ Pasta Audio não encontrada"
    exit 1
fi

if [ -d "public/Images" ]; then
    echo "✅ Pasta Images encontrada"
else
    echo "❌ Pasta Images não encontrada"
    exit 1
fi

if [ -f "index.html" ]; then
    echo "✅ index.html encontrado"
else
    echo "❌ index.html não encontrado"
    exit 1
fi

echo "🎉 Site estático pronto para deploy!"
echo "📊 Estatísticas:"
echo "   - Arquivos de áudio: $(find public/Audio -name "*.mp3" | wc -l)"
echo "   - Arquivos de imagem: $(find public/Images -name "*" -type f | wc -l)"
echo "   - Tamanho total: $(du -sh . | cut -f1)"
