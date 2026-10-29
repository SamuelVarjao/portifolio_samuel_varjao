/**
 * ============================================================
 *  CONFIGURAÇÕES GERAIS DO SITE
 *  Edite apenas os valores abaixo. Não é preciso mexer no layout.
 * ============================================================
 */
window.SITE_CONFIG = {
  // E-mail exibido no site e usado como alternativa ao formulário.
  email: "varjao.samueloliveira@gmail.com",

  // WhatsApp com DDI + DDD + número, só dígitos. Ex.: "5511999999999".
  // Usado no botão "Chamar no WhatsApp" e nos links "Falar comigo".
  // Se ficar vazio, o botão some e os links levam à seção de contato.
  whatsapp: "5511964500252",

  // ID do formulário no Formspree (https://formspree.io).
  // Ao criar o formulário, o endpoint será algo como https://formspree.io/f/abcdwxyz
  // → cole aqui só a parte final: "abcdwxyz".
  // Enquanto estiver vazio, o formulário abre o app de e-mail do visitante (mailto).
  formspreeId: "",

  // Chaves usadas no localStorage do navegador.
  storageKeys: {
    lang: "sv-lang",
    theme: "sv-theme",
  },
};
