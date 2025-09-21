# 🏛️ AppTravel - Guia de Viagem de Bolso

Um aplicativo web interativo de guia turístico focado na **Itália**, oferecendo informações detalhadas sobre cidades, monumentos e atrações com recursos multimídia.

## 🚀 Deploy no Netlify

Este é um **site estático** que não requer build. Simplesmente faça upload dos arquivos.

### Configuração do Netlify:
- **Build command**: `echo 'Static site - no build needed'`
- **Publish directory**: `.`
- **Node version**: 18

## 📁 Estrutura

```
AppTravel/
├── index.html              # Página principal
├── App.jsx                 # Aplicação React
├── App.css                 # Estilos
├── data_structure.json     # Dados das atrações
├── public/
│   ├── Audio/              # Arquivos de áudio (MP3)
│   └── Images/             # Imagens das atrações
└── netlify.toml           # Configuração do Netlify
```

## 🎵 Recursos

- **38 atrações** com áudio e imagens
- **6 cidades italianas**: Roma, Florença, Milão, Pisa, San Gimignano, Siena
- **Interface responsiva** para mobile e desktop
- **Sistema de favoritos** e visitas
- **Navegação intuitiva** por países → cidades → atrações

## 🛠️ Tecnologias

- React 18 (via CDN)
- Tailwind CSS (via CDN)
- HTML5 Audio
- LocalStorage para persistência

## 📱 Como usar

1. Acesse o site
2. Navegue pelas cidades
3. Clique nas atrações para ver detalhes
4. Ouça os áudios narrativos
5. Marque como favorito ou visitado

---

**Desenvolvido por Liz Werner** | **2024**
