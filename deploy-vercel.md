# 🚀 Deploy no Vercel - Guia Passo a Passo

## 📋 Pré-requisitos
- Conta no Vercel (gratuita)
- Arquivos do projeto comprimidos em ZIP

## 🔧 Passo a Passo

### 1. Acesse o Vercel
- Vá para [vercel.com](https://vercel.com)
- Clique em "Sign Up" ou "Login"
- Use sua conta Google, GitHub ou email

### 2. Faça Upload do Projeto
- Clique em "New Project"
- Escolha "Upload" (não GitHub)
- Arraste o arquivo ZIP do AppTravel
- Clique em "Deploy"

### 3. Configuração Automática
- O Vercel detectará automaticamente que é um site estático
- Não precisa configurar build command
- Deploy será feito em 1-2 minutos

### 4. Acesse seu Site
- Após o deploy, você receberá uma URL
- Exemplo: `https://apptravel-abc123.vercel.app`
- Teste: `https://seu-site.vercel.app/index-test.html`

## ✅ Vantagens do Vercel
- **Mais simples** que Netlify
- **Deploy mais rápido**
- **Menos erros** de configuração
- **CDN global** (mais rápido)
- **HTTPS automático**

## 🔧 Se Precisar de Configuração Manual
- Build Command: deixe vazio
- Output Directory: `.`
- Install Command: deixe vazio

## 🎯 Teste Após Deploy
1. Site principal: `https://seu-site.vercel.app`
2. Teste diagnóstico: `https://seu-site.vercel.app/index-test.html`
3. Áudio direto: `https://seu-site.vercel.app/public/Audio/ROMA_Coliseu.mp3`
4. Imagem direta: `https://seu-site.vercel.app/public/Images/ROMA_Coliseu.jpg`

## 🆘 Se Der Problema
- Verifique se o ZIP contém a pasta `public/`
- Confirme que `index.html` está na raiz
- Teste localmente primeiro com `npx serve .`
