import type { Testimonial } from "../sections/plugins/Testimonials";

// Feedback from user tests supplied by the product owner, who confirmed
// authenticity and five-star ratings. Preserve comments and source ratings.
const copyPastaComments = [
  "Cara, como é que o Premiere não faz isto nativamente até hoje? Salvou-me a vida.",
  "Finalmente acabou o cemitério de prints na minha pasta de Downloads kkkk",
  "Ctrl+V direto na timeline… que paz de espírito, mano.",
  "Poupa-me facilmente uns 20 minutos de fluxo de trabalho por dia só nisto.",
  "Melhor plugin que instalei este ano, simples e direto ao ponto.",
  "A minha área de trabalho agradece, já não aguentava mais tanto print solto.",
  "Instalei hoje e já não consigo editar sem isto. Essencial!",
  "Parece uma coisa básica, mas a diferença que faz no ritmo da edição é absurda.",
  "Vale cada cêntimo só por não ter de ficar a renomear JPG aleatório.",
  "Genial demais! Funciona lisinho aqui.",
  "O tipo de ferramenta que devia vir de fábrica na Adobe. Parabéns aos envolvidos!",
  "Copiou do navegador, colou na timeline. Sem fricção nenhuma, muito bom.",
  "Rápido, leve e cumpre exatamente o que promete.",
  "Acabou o rolê de: salvar imagem > abrir explorer > arrastar pro projeto. Obrigado!",
  "Isto aqui é puro ganho de produtividade para quem faz vídeo dinâmico.",
  "Funciona super bem com PNG transparente também? Aqui foi direto, curti muito.",
  "O meu workflow agradece demais, top!",
  "Quem edita conteúdo para a internet sabe o alívio que isto dá no dia a dia.",
  "Simplesmente não sei mais viver sem isso na timeline haha",
  "Top demais, super estável até agora!",
];

const importerComments = [
  "Não precisar de abrir sites manhosos cheios de vírus para descarregar vídeo do TikTok já vale o plugin inteiro.",
  "Colar o link e já cair direto na timeline pronto a cortar é surreal de bom!",
  "Adeus, conversores cheios de anúncios no navegador kkkk muito obrigado por isto.",
  "Uso muito take de reels e memes nos cortes, isto aqui acelerou o meu trabalho a 200%.",
  "Funciona com shorts e vídeos longos do YouTube também? Aqui puxou na hora em boa qualidade.",
  "Só de não travar o Premiere ao puxar o ficheiro já ganhou o meu respeito.",
  "O fluxo de produção de vídeos curtos ficou infinitamente mais rápido com isto.",
  "Muito prático! O áudio e o vídeo vêm perfeitamente sincronizados.",
  "Uma mão na roda absurda para quem edita react ou compilações.",
  "O tempo que eu perdia a baixar coisas do Insta agora é zero. Ferramenta indispensável!",
  "Melhor investimento para o meu dia a dia na ilha de edição.",
  "Cai direto com a taxa de quadros certinha, muito bom mesmo.",
  "Adeus pastas temporárias entupidas de vídeos da internet, direto pro projeto e pronto.",
  "Muito limpo e sem enrolação, interface super direta.",
  "Que facilidade! Puxa do TikTok até sem a marca d'água? Sensacional.",
  "Isto devia ser um padrão da indústria, agiliza imenso o trabalho de quem faz cortes.",
  "Mais alguém sentiu um alívio gigante de não precisar usar sites duvidosos da web? kkkk",
  "Atualização impecável, está a rodar suave aqui na última versão do Premiere.",
  "Valeu a pena demais, já recomendei para todos os editores do meu grupo.",
  "Incrível como poupa cliques desnecessários. Essencial no meu dia a dia!",
];

export function getTestimonialsForPlugin(slug: string): Testimonial[] {
  const comments = slug === "copy-pasta" ? copyPastaComments : slug === "youtube-importer" ? importerComments : [];
  return comments.map((comment, index) => ({ id: `${slug}-${index + 1}`, comment, rating: 5 }));
}
