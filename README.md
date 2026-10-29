# Portfólio — Samuel Varjão

Site de portfólio pessoal, estático (HTML, CSS e JavaScript puro, sem framework e sem build), pronto para o GitHub Pages. Bilíngue (PT/EN), com tema escuro/claro, responsivo e acessível.

## Estrutura de pastas

```
portifolio_samu/
├── index.html                 Estrutura da página (sem textos fixos: tudo vem do i18n.js)
├── .nojekyll                  Faz o GitHub Pages servir os arquivos como estão
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css          Estilos (mobile first). Cores no topo do arquivo
│   ├── js/
│   │   ├── config.js          E-mail, WhatsApp, ID do Formspree
│   │   ├── i18n.js            Todos os textos em português e inglês
│   │   ├── projects.js        Lista de projetos (cards)
│   │   └── main.js            Comportamento: idioma, tema, menu, formulário…
│   ├── fonts/                 Comic Neue (reserva para aparelhos sem Comic Sans)
│   └── img/
│       ├── favicon.svg, favicon-32.png, apple-touch-icon.png
│       ├── og-image.png       Imagem de compartilhamento (1200x630)
│       └── projects/          Capas dos projetos (800x500, JPEG)
└── tools/                     Scripts opcionais (Windows) para gerar imagens
    ├── capture-covers.ps1     Tira print dos sites e gera as capas
    ├── build-images.ps1       Gera og-image.png e os ícones
    └── og-image.html          Modelo da imagem de compartilhamento
```

## 1. Rodar o site localmente

O site precisa ser aberto por um servidor local (abrir o `index.html` com duplo clique também funciona, mas um servidor imita melhor o GitHub Pages).

Com Python (já instalado na sua máquina), na pasta do projeto:

```bash
python -m http.server 5500
```

Depois abra http://localhost:5500 no navegador. Para parar, `Ctrl + C`.

Alternativas: `npx serve` (Node.js) ou a extensão **Live Server** do VS Code (botão "Go Live").

## 2. Adicionar um novo projeto

1. Abra `assets/js/projects.js`.
2. Copie um bloco `{ ... }` inteiro e cole no fim da lista (com vírgula entre os blocos):

   ```js
   {
     name: "Nome do Cliente",
     url: "https://www.site-do-cliente.com.br/",
     image: "assets/img/projects/nome-do-cliente.jpg",
     type: { pt: "Clínica odontológica", en: "Dental clinic" },
     description: {
       pt: "Descrição curta em português.",
       en: "Short description in English.",
     },
     tech: ["React", "JavaScript"],
   },
   ```

3. **Capa:** coloque a imagem em `assets/img/projects/` (ideal 800x500 px, `.jpg` ou `.webp`, até ~100 KB) e aponte o caminho em `image`.
   - Sem imagem ainda? Use `image: ""` e o site gera uma capa provisória com as iniciais do projeto.
   - Para gerar a capa automaticamente com um print do site (Windows + Chrome ou Edge):
     ```bash
     powershell -ExecutionPolicy Bypass -File tools\capture-covers.ps1 -Only nome-do-cliente
     ```
     O script lê o `url` e o `image` do `projects.js` e salva a capa já otimizada. Sem `-Only`, refaz todas.
4. Salve e recarregue a página. O contador "sites neste portfólio" atualiza sozinho.

A ordem na lista é a ordem dos cards no site.

## 3. Editar os textos (português e inglês)

- Todos os textos ficam em `assets/js/i18n.js`, com um bloco `pt` e outro `en`, que têm as mesmas chaves.
- Para mudar um texto, edite o valor nos dois blocos. Exemplo: o subtítulo do topo é `hero.lead`.
- Para descobrir qual chave é qual, procure no `index.html` o atributo `data-i18n="..."` do elemento.
- Para criar um texto novo: adicione a chave em `pt` e em `en` e use `data-i18n="secao.chave"` no HTML. Para atributos (placeholder, aria-label), use `data-i18n-attr="placeholder:secao.chave"`.
- Textos dos projetos (tipo e descrição) ficam no próprio `projects.js`.
- E-mail, WhatsApp e Formspree ficam em `assets/js/config.js`.

**Como o idioma é escolhido:** `?lang=en` na URL → escolha salva no navegador (localStorage) → idioma do navegador (inglês abre em inglês) → português.

## 4. Trocar a cor de destaque

No topo de `assets/css/style.css`:

```css
:root {
  --accent: #7cc4ff;          /* fundo dos botões, adesivos e fitas */
  --accent-contrast: #11140a; /* texto em cima da cor de destaque */
}
```

E, em cada tema, a cor usada em links e textos de destaque:

```css
:root[data-theme="dark"]  { --accent-text: #7cc4ff; --accent-soft: rgba(124, 196, 255, .12); --marker: rgba(124, 196, 255, .32); --focus: #7cc4ff; }
:root[data-theme="light"] { --accent-text: #1a56c4; --accent-soft: rgba(26, 86, 196, .1); --marker: rgba(124, 196, 255, .65); --focus: #1a56c4; }
```

Dicas para manter o contraste WCAG AA:
- `--accent-contrast` precisa ter contraste de pelo menos 4.5:1 com `--accent` (cor clara → texto escuro).
- No tema claro, `--accent-text` deve ser uma versão **escura** da cor (contraste mínimo de 4.5:1 com `#fbfaf3`). `--marker` é a cor do marca-texto. Teste em https://webaim.org/resources/contrastchecker/
- Também troque a cor no `favicon.svg` e em `tools/og-image.html` se quiser manter tudo combinando (depois rode `tools\build-images.ps1`).

## 5. Animações

Tudo respeita a opção "reduzir movimento" do sistema: quem a ativa vê o site sem animações.

- **Ao rolar:** qualquer elemento com a classe `reveal` aparece ao entrar na tela. O atributo `data-reveal` escolhe o efeito:
  - sem atributo: sobe;
  - `"left"` / `"right"`: vem da esquerda ou da direita;
  - `"scale"`: cresce levemente;
  - `"fade"`: só aparece.
- **Títulos palavra por palavra:** basta adicionar `data-split` ao título, como em `<h2 data-i18n="..." data-split>`.
- **Velocidade:** no topo do `style.css`, `--dur-reveal` controla a duração das entradas e `--ease-out` a curva de desaceleração.
- **Outros efeitos (em `main.js`, função `initScrollEffects`):**
  - parallax do hero;
  - barra de progresso no topo;
  - linha do tempo que se desenha conforme a rolagem.
- **Troca de tema e idioma:** usa a View Transitions API. O tema novo se expande em círculo a partir do botão e o idioma troca com um crossfade. Navegadores sem suporte trocam na hora.

## 6. Configurar o formulário e o WhatsApp

**Formulário (Formspree, gratuito até 50 envios/mês):**
1. Crie uma conta em https://formspree.io e clique em **New Form**, usando o seu e-mail.
2. Copie o ID do endpoint (em `https://formspree.io/f/abcdwxyz`, o ID é `abcdwxyz`).
3. Cole em `assets/js/config.js` → `formspreeId: "abcdwxyz"`.
4. Faça um envio de teste e confirme o e-mail de ativação que o Formspree mandar.

Enquanto `formspreeId` estiver vazio, o botão "Enviar" abre o aplicativo de e-mail do visitante com a mensagem já preenchida.

**WhatsApp:** o número fica em `config.js` (`whatsapp: "5511964500252"`, com DDI + DDD, só dígitos). Ele é usado no botão "Chamar no WhatsApp" do contato e nos links "Falar comigo" (marcados com `data-whatsapp` no HTML). Se o campo ficar vazio, o botão some e os links levam à seção de contato.

## 7. Publicar no GitHub Pages

1. Crie um repositório no GitHub.
   - Se o nome for **`samuelvarjao.github.io`**, o site fica em `https://samuelvarjao.github.io/`, o endereço que já está configurado nas meta tags.
   - Se usar outro nome (ex.: `portfolio`), o endereço será `https://samuelvarjao.github.io/portfolio/`. Nesse caso, troque a URL no `<head>` do `index.html` (tags `canonical`, `alternate`, `og:url`, `og:image`, `twitter:image` e o JSON-LD).
2. Envie os arquivos. Pelo terminal, na pasta do projeto:

   ```bash
   git init
   ```
   ```bash
   git add .
   ```
   ```bash
   git commit -m "Primeira versão do portfólio"
   ```
   ```bash
   git branch -M main
   ```
   ```bash
   git remote add origin https://github.com/samuelvarjao/samuelvarjao.github.io.git
   ```
   ```bash
   git push -u origin main
   ```

   (Ou arraste os arquivos em **Add file → Upload files** no site do GitHub.)
3. No repositório: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, pasta `/ (root)` → **Save**.
4. Em 1 ou 2 minutos o site estará no ar. Atualizações: é só fazer novo commit e push.

Depois de publicar, teste o compartilhamento em https://www.opengraph.xyz e a nota em https://pagespeed.web.dev.

## Observações

- **Fonte:** o site usa Comic Sans, que já vem instalada no Windows e no macOS. Android e iPhone não têm essa fonte, então nesses aparelhos o site carrega a Comic Neue (pasta `assets/fonts`), uma versão aberta e muito parecida. Para trocar a fonte, altere `--font` no topo do `style.css`.

- **SEO nos dois idiomas:** o Google executa JavaScript e enxerga título e descrição em inglês via `?lang=en` (há tags `hreflang`). Já WhatsApp, LinkedIn e outras redes leem só o HTML inicial, então a prévia de link mostra sempre a versão em português. A imagem de compartilhamento é bilíngue.
- **Movimento reduzido:** quem ativa "reduzir movimento" no sistema vê o site sem animações.
- **Lighthouse** (medido localmente, com compressão gzip como no GitHub Pages): desktop 100 / 100 / 100 / 100. No celular, desempenho entre 94 e 95 (varia com a máquina) e 100 em acessibilidade, boas práticas e SEO.
