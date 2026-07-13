# Monta Prato — como colocar no ar (passo a passo)

Tudo por interface gráfica. Sem terminal. ~20 minutos.

---

## Antes de começar: salve seus dados atuais

Se você já usa o app publicado no Claude e tem registros:
1. Abra o app atual → aba **Progresso** → **Backup dos meus dados** → **Gerar backup** → **Copiar**.
2. Cole num bloco de notas e guarde. Você vai restaurar isso no fim.

---

## Passo 1 — Criar conta no GitHub

1. Acesse **github.com** → **Sign up**.
2. Crie a conta (email, senha, usuário). É gratuito.

## Passo 2 — Subir os arquivos do projeto

1. No GitHub, clique no **+** (canto superior direito) → **New repository**.
2. Nome: `monta-prato`. Deixe **Private** marcado. Clique em **Create repository**.
3. Na página seguinte, clique em **uploading an existing file**.
4. **Descompacte o arquivo `monta-prato.zip`** que recebeu e **arraste TODAS as pastas e arquivos** de dentro dele para a área de upload.
   - Importante: arraste o *conteúdo* (as pastas `src`, `netlify`, `public` e os arquivos soltos), não a pasta zipada inteira.
5. Clique em **Commit changes**.

## Passo 3 — Pegar a chave da API da Anthropic

1. Acesse **platform.claude.com** e entre com sua conta.
2. Vá em **Billing** e adicione **US$ 5 de crédito pré-pago**.
   - ⚠️ **Deixe a recarga automática (auto-reload) DESLIGADA.** Assim é impossível gastar mais que os US$ 5.
3. Vá em **API Keys** → **Create Key**. Copie a chave (começa com `sk-ant-...`).
   - Ela só aparece uma vez. Guarde num lugar seguro.
   - **Nunca** coloque essa chave dentro do código nem mande pra ninguém.

## Passo 4 — Publicar na Netlify

1. Acesse **netlify.com** → **Sign up** → escolha **entrar com GitHub**.
2. Clique em **Add new site** → **Import an existing project** → **GitHub**.
3. Autorize e escolha o repositório **monta-prato**.
4. As configurações já vêm prontas do arquivo `netlify.toml`. Só confira:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **ANTES de clicar em Deploy**, abra **Add environment variables** (ou faça depois em Site settings → Environment variables) e adicione:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** sua chave `sk-ant-...`
6. Clique em **Deploy**.
7. Espere ~2 minutos. A Netlify te dá um link tipo `algum-nome.netlify.app`.
   - Para trocar o nome: **Site configuration → Change site name** → escolha `monta-prato` (ou o que quiser).

## Passo 5 — Instalar no celular

1. Abra o link da Netlify no **Chrome** do Android.
2. Menu (⋮) → **Instalar app** (ou "Adicionar à tela inicial").
3. Agora aparece um ícone próprio do **Monta Prato** na sua tela — com nome e ícone certos, abrindo em tela cheia.

## Passo 6 — Restaurar seus dados

1. No app, vá em **Progresso → Backup dos meus dados → Restaurar**.
2. Cole o backup que você guardou lá no começo → **Restaurar dados**.

---

## Como atualizar o app no futuro

Muito mais simples que antes:
1. Peça a versão nova ao Claude.
2. No GitHub, abra `src/App.jsx` → clique no **lápis** (editar) → apague tudo → cole o novo código → **Commit changes**.
3. A Netlify atualiza sozinha em ~2 minutos, **na mesma URL**. O ícone no seu celular já abre a versão nova.

Seus dados ficam no celular (localStorage), então **não se perdem** nas atualizações. Mesmo assim, gere um backup de vez em quando.

---

## Sobre o custo

- **Netlify: grátis** (o plano free cobre isso de sobra).
- **API da Anthropic:** você paga só pelo que usar, descontado dos US$ 5 pré-pagos.
- Com as otimizações aplicadas (cache de prompt, prompts enxutos, limites de saída), o uso normal deve custar em torno de **US$ 1 a 1,50 por mês**.
- Com US$ 5 e sem recarga automática, **você não corre risco de susto na fatura**: se os créditos acabarem, o app só para de gerar até você recarregar.
- Dá pra acompanhar o gasto em **platform.claude.com → Usage**.

## Otimizações já aplicadas

- ✅ **Cache de prompt** — as regras fixas (seu perfil, instruções) são cacheadas e custam ~10% nas chamadas seguintes. Maior economia, zero perda de qualidade.
- ✅ **Prompts enxutos** — o perfil aprendido envia só o essencial.
- ✅ **Limites de saída** — evita respostas maiores que o necessário (output custa 5x o input).
- ✅ **Cache local de estimativas** — não pergunta duas vezes as calorias do mesmo ingrediente.
- ✅ **Modelo Sonnet mantido** — qualidade preservada nas estimativas de caloria.

## Segurança

Sua chave da API fica **só no servidor da Netlify** (na variável de ambiente), nunca no navegador. O app conversa com uma função interna (`/api/claude`) que faz a chamada por você. Ninguém consegue extrair sua chave abrindo o site.
