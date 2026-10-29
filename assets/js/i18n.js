/**
 * ============================================================
 *  TRADUÇÕES DO SITE (PT / EN)
 *
 *  - Cada texto do site tem uma "chave" (ex.: "hero.lead").
 *  - No HTML, o elemento aponta para a chave com data-i18n="hero.lead".
 *  - Para editar um texto, altere o valor em "pt" e em "en" abaixo.
 *  - Para criar um texto novo, adicione a mesma chave nos dois idiomas.
 *  - Textos dos projetos ficam em assets/js/projects.js.
 *  - Marcadores como {name} e {email} são preenchidos automaticamente.
 * ============================================================
 */
window.I18N = {
  pt: {
    meta: {
      title: "Samuel Varjão | Web Designer e Desenvolvedor Web em São Paulo",
      description:
        "Portfólio de Samuel Varjão de Oliveira, web designer e desenvolvedor web. Faço sites institucionais para clínicas, farmácias, cafeterias e outros pequenos negócios.",
      ogLocale: "pt_BR",
      ogImageAlt: "Samuel Varjão, web designer e desenvolvedor web",
    },

    a11y: {
      skip: "Pular para o conteúdo",
      navLabel: "Menu principal",
      menuOpen: "Abrir menu",
      menuClose: "Fechar menu",
      themeToLight: "Ativar tema claro",
      themeToDark: "Ativar tema escuro",
      langGroup: "Idioma do site",
      langPt: "Português",
      langEn: "Inglês",
      newTab: "(abre em nova aba)",
    },

    brand: "Samuel Varjão",

    nav: {
      about: "Sobre",
      projects: "Projetos",
      services: "Serviços",
      contact: "Contato",
    },

    hero: {
      name: "Samuel Varjão de Oliveira",
      role: "Web designer e desenvolvedor web",
      lead: "Faço sites para pequenos negócios. Eles carregam rápido, funcionam bem no celular e aparecem no Google.",
      ctaProjects: "Ver projetos",
      ctaContact: "Falar comigo",
      photoAlt: "Samuel Varjão sorrindo, de óculos e camisa branca, em frente a uma parede de azulejos coloridos",
    },

    about: {
      eyebrow: "Sobre",
      title: "Um pouco sobre mim",
      p1: "Sou formado em Sistemas de Informação pela Universidade de Mogi das Cruzes (UMC). Desde 2021 cuido do site da Farmácia Águia de Ouro. Em 2024 comecei a trabalhar como freelancer e já atuei com clínicas, farmácias, cafeterias e entre outros.",
      factEducation: "Formação",
      factEducationValue: "Sistemas de Informação na UMC, concluído em 2025",
      factLocation: "Onde estou",
      factLocationValue: "São Paulo (SP)",
      factLanguages: "Idiomas",
      factLanguagesValue: "Português e inglês",
    },

    projects: {
      eyebrow: "Projetos",
      title: "Sites que coloquei no ar",
      intro:
        "A maioria é de sites institucionais com SEO pensado para campanhas no Google Ads. Alguns são projetos meus, feitos para praticar.",
      viewSite: "Ver site",
      coverAlt: "Página inicial do site {name}",
      techLabel: "Tecnologias usadas",
    },

    services: {
      eyebrow: "Serviços",
      title: "No que posso ajudar",
      webTitle: "Criação de sites",
      webText:
        "Sites institucionais e landing pages feitos do zero, que funcionam bem no celular e já saem prontos para o Google.",
      socialTitle: "Gestão de redes sociais",
      socialText:
        "Cuido das redes sociais da sua empresa, criando as artes e organizando as publicações.",
      adsTitle: "Gestão de tráfego pago",
      adsText:
        "Crio e acompanho anúncios no Google Ads e nas redes sociais para levar mais clientes ao seu negócio.",
      integrationsTitle: "Integrações",
      integrationsText:
        "Formulário que chega no seu e-mail, botão de WhatsApp e ferramentas de marketing ligadas ao site.",
      identityTitle: "Identidade visual básica",
      identityText:
        "Cores, fontes e peças visuais (também no Canva) para a sua marca ficar com a mesma cara em todo lugar.",
      ctaTitle: "Precisa de outra coisa?",
      ctaText: "Me conte o que você tem em mente e eu digo se consigo fazer.",
      ctaLink: "Falar comigo",
    },

    tech: {
      eyebrow: "Tecnologias",
      title: "O que eu uso no dia a dia",
      htmlName: "HTML",
      htmlText: "Estrutura das páginas",
      cssName: "CSS",
      cssText: "Layout e animações",
      jsName: "JavaScript",
      jsText: "Interações e integrações",
      reactName: "React",
      reactText: "Sites feitos em componentes",
      wordpressName: "WordPress",
      wordpressText: "Sites que o cliente edita",
      canvaName: "Canva",
      canvaText: "Peças para redes e marca",
    },

    experience: {
      eyebrow: "Experiência",
      title: "Onde já trabalhei",
      toPresent: "até hoje",
      aguiaCompany: "Farmácia Águia de Ouro",
      aguiaRole: "Web designer e desenvolvedor web",
      aguiaText:
        "Fiz o site da empresa e continuo cuidando dele. Atualizo o conteúdo, ajusto o layout e configurei as integrações.",
      aguiaTag1: "Criação do site",
      aguiaTag2: "Manutenção",
      aguiaTag3: "Integrações",
      freelaCompany: "Freelancer",
      freelaRole: "Web designer e desenvolvedor web",
      freelaText:
        "Já atendi mais de 20 clientes, trabalhando como terceirizado para outras empresas. Entre eles há clínicas, farmácias e cafeterias. Faço sites, layouts e peças visuais, configuro formulários que enviam e-mail e cuido do marketing digital de alguns clientes.",
      freelaTag1: "Sites e layouts",
      freelaTag2: "Peças visuais",
      freelaTag3: "Formulários e e-mail",
      freelaTag4: "Marketing digital",
    },

    contact: {
      eyebrow: "Contato",
      title: "Tem um projeto em mente?",
      lead: "Me conte sobre o seu negócio e o que você precisa. Respondo assim que puder.",
      emailLabel: "E-mail",
      whatsapp: "Chamar no WhatsApp",
      whatsappMessage:
        "Olá, Samuel! Vi seu portfólio e gostaria de conversar sobre um projeto.",
      location: "São Paulo (SP)",
    },

    form: {
      title: "Mande uma mensagem",
      required: "Preencha todos os campos.",
      name: "Nome",
      namePlaceholder: "Como posso te chamar?",
      email: "E-mail",
      emailPlaceholder: "voce@empresa.com.br",
      message: "Mensagem",
      messagePlaceholder:
        "Conte sobre o projeto, o prazo e o que você quer que o site faça.",
      honeypot: "Não preencha este campo",
      submit: "Enviar mensagem",
      sending: "Enviando...",
      success: "Mensagem enviada. Obrigado! Respondo em breve.",
      error: "Não deu para enviar agora. Tente de novo ou escreva para {email}.",
      mailtoFallback: "Abrindo seu aplicativo de e-mail para terminar o envio...",
      subject: "Novo contato pelo portfólio",
      invalidSummary: "Confira os campos marcados.",
      errors: {
        nameRequired: "Escreva seu nome.",
        emailRequired: "Escreva seu e-mail.",
        emailInvalid: "Esse e-mail parece ter algum erro. Pode conferir?",
        messageRequired: "Escreva uma mensagem.",
        messageShort: "Escreva pelo menos 10 caracteres.",
      },
    },

    footer: {
      name: "Samuel Varjão de Oliveira",
      rights: "Todos os direitos reservados.",
      top: "Voltar ao topo",
    },
  },

  en: {
    meta: {
      title: "Samuel Varjão | Web Designer & Developer",
      description:
        "Portfolio of Samuel Varjão de Oliveira, a web designer and developer in São Paulo, Brazil. I build websites for clinics, pharmacies, coffee shops and other small businesses.",
      ogLocale: "en_US",
      ogImageAlt: "Samuel Varjão, web designer and developer",
    },

    a11y: {
      skip: "Skip to content",
      navLabel: "Main navigation",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      themeToLight: "Switch to light theme",
      themeToDark: "Switch to dark theme",
      langGroup: "Site language",
      langPt: "Portuguese",
      langEn: "English",
      newTab: "(opens in a new tab)",
    },

    brand: "Samuel Varjão",

    nav: {
      about: "About",
      projects: "Work",
      services: "Services",
      contact: "Contact",
    },

    hero: {
      name: "Samuel Varjão de Oliveira",
      role: "Web designer and developer",
      lead: "I build websites for small businesses. They load fast, work well on phones and show up on Google.",
      ctaProjects: "See my work",
      ctaContact: "Get in touch",
      photoAlt: "Samuel Varjão smiling, wearing glasses and a white shirt, in front of a colorful tiled wall",
    },

    about: {
      eyebrow: "About",
      title: "A bit about me",
      p1: "I have a degree in Information Systems from the University of Mogi das Cruzes (UMC). I've looked after the website for Águia de Ouro Pharmacy since 2021. In 2024 I started freelancing, and I've worked with clinics, pharmacies, coffee shops and other businesses.",
      factEducation: "Education",
      factEducationValue: "B.S. in Information Systems, UMC, 2025",
      factLocation: "Based in",
      factLocationValue: "São Paulo, Brazil",
      factLanguages: "Languages",
      factLanguagesValue: "Portuguese and English",
    },

    projects: {
      eyebrow: "Work",
      title: "Sites I've launched",
      intro:
        "Most of these are business websites with SEO set up for Google Ads campaigns. A few are my own projects, built for practice.",
      viewSite: "Visit site",
      coverAlt: "Homepage of the {name} website",
      techLabel: "Built with",
    },

    services: {
      eyebrow: "Services",
      title: "What I can do for you",
      webTitle: "Website design and development",
      webText:
        "Business websites and landing pages built from scratch. They work well on phones and are ready for Google from the start.",
      socialTitle: "Social media management",
      socialText:
        "I run your company's social media, from designing the posts to planning when they go out.",
      adsTitle: "Paid ads management",
      adsText:
        "I set up and monitor Google Ads and social media ads to bring more customers to your business.",
      integrationsTitle: "Integrations",
      integrationsText:
        "Contact forms that go straight to your inbox, a WhatsApp button and marketing tools hooked up to your site.",
      identityTitle: "Basic branding",
      identityText:
        "Colors, fonts and graphics (Canva included) so your brand looks the same everywhere.",
      ctaTitle: "Need something else?",
      ctaText: "Tell me what you have in mind and I'll let you know if I can do it.",
      ctaLink: "Get in touch",
    },

    tech: {
      eyebrow: "Toolkit",
      title: "What I use every day",
      htmlName: "HTML",
      htmlText: "Page structure",
      cssName: "CSS",
      cssText: "Layout and animation",
      jsName: "JavaScript",
      jsText: "Interactivity and integrations",
      reactName: "React",
      reactText: "Component-based sites",
      wordpressName: "WordPress",
      wordpressText: "Sites clients can edit",
      canvaName: "Canva",
      canvaText: "Social and brand graphics",
    },

    experience: {
      eyebrow: "Experience",
      title: "Where I've worked",
      toPresent: "to present",
      aguiaCompany: "Águia de Ouro Pharmacy",
      aguiaRole: "Web designer and developer",
      aguiaText:
        "I built the company website and still maintain it. I keep the content up to date, adjust the layout and set up its integrations.",
      aguiaTag1: "Site build",
      aguiaTag2: "Maintenance",
      aguiaTag3: "Integrations",
      freelaCompany: "Freelance",
      freelaRole: "Web designer and developer",
      freelaText:
        "I've worked with more than 20 clients as a subcontractor for other companies, including clinics, pharmacies and coffee shops. I build websites, layouts and graphics, set up contact forms that send email, and handle digital marketing for some clients.",
      freelaTag1: "Websites and layouts",
      freelaTag2: "Graphics",
      freelaTag3: "Forms and email",
      freelaTag4: "Digital marketing",
    },

    contact: {
      eyebrow: "Contact",
      title: "Have a project in mind?",
      lead: "Tell me about your business and what you need. I'll get back to you as soon as I can.",
      emailLabel: "Email",
      whatsapp: "Message me on WhatsApp",
      whatsappMessage:
        "Hi Samuel! I saw your portfolio and would like to talk about a project.",
      location: "São Paulo, Brazil",
    },

    form: {
      title: "Send me a message",
      required: "Please fill in every field.",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@company.com",
      message: "Message",
      messagePlaceholder:
        "Tell me about the project, your timeline and what you want the site to do.",
      honeypot: "Leave this field empty",
      submit: "Send message",
      sending: "Sending...",
      success: "Message sent. Thanks! I'll reply soon.",
      error: "That didn't go through. Please try again or email me at {email}.",
      mailtoFallback: "Opening your email app so you can finish sending...",
      subject: "New inquiry from your portfolio",
      invalidSummary: "Please check the highlighted fields.",
      errors: {
        nameRequired: "Please enter your name.",
        emailRequired: "Please enter your email.",
        emailInvalid: "That email looks off. Could you check it?",
        messageRequired: "Please write a message.",
        messageShort: "Please write at least 10 characters.",
      },
    },

    footer: {
      name: "Samuel Varjão de Oliveira",
      rights: "All rights reserved.",
      top: "Back to top",
    },
  },
};
