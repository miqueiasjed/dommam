import { useState, useEffect } from 'react';
import './LandingPage.css';

const faqs = [
  {
    q: 'Quantos roteiros recebo por mês exatamente?',
    a: 'No mínimo 8. Em meses de alta produção, podem chegar a 10 ou 12. O mínimo está garantido em qualquer cenário.',
  },
  {
    q: 'Por que o plano anual sai tão mais barato?',
    a: 'Porque a previsibilidade da receita anual me permite investir na produção e manter o ritmo de 8+ roteiros mensais com qualidade. Quem se compromete com o ano inteiro divide esse benefício com o produto.',
  },
  {
    q: 'Posso migrar do mensal para o anual depois?',
    a: 'Sim. Você pode fazer upgrade a qualquer momento, e os meses já pagos no mensal são abatidos do valor anual.',
  },
  {
    q: 'Preciso ter perfil no Instagram para usar os roteiros?',
    a: 'Não. O método se aplica a qualquer canal — YouTube, TikTok, podcast, aulas, palestras. O Instagram é só o laboratório onde eu testo.',
  },
  {
    q: 'Posso usar os roteiros como modelo para meus próprios vídeos?',
    a: 'Sim, o método é seu para aplicar. Só não pode publicar o roteiro idêntico nem usar a mesma assinatura visual do @danuzio_history.',
  },
  {
    q: 'Os roteiros são de quais temas?',
    a: 'História, geopolítica, eventos marcantes do século XX e XXI, com ângulos que escapam do óbvio. O calendário editorial varia conforme o que está em alta no momento.',
  },
  {
    q: 'Por que apenas 1 hora antes e não 24h ou uma semana antes?',
    a: 'Porque uma hora é o intervalo que preserva o seu sentido de exclusividade sem comprometer a operação editorial. Mais que isso, o roteiro vazaria. Menos que isso, perderia o sentido de antecipação.',
  },
  {
    q: 'Como recebo os roteiros?',
    a: 'Pela área de membros exclusiva. Você acessa, faz o download em PDF e o material fica disponível para consulta a qualquer momento.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="landing-page">
      <div className="lp-grain" aria-hidden="true" />

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-container lp-nav-inner">
          <div className="lp-logo">Danuzio History <span>Backstage</span></div>
          <a href="#planos" className="lp-nav-cta">Entrar agora</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-marker">Área de membros · @danuzio_history</div>
          <h1 className="lp-hero-title">
            Veja, <em>uma hora antes do mundo</em>, como cada vídeo viral é construído.
          </h1>
          <p className="lp-hero-sub">
            A área de membros onde você recebe — antes da publicação — o{' '}
            <strong>roteiro completo</strong>, a direção cinematográfica, os prompts de IA e a
            checagem de fatos por trás de cada vídeo do <strong>@danuzio_history</strong>. O mesmo
            material que entrego ao meu editor. Agora aberto a você.
          </p>
          <div className="lp-hero-cta">
            <a href="#planos" className="lp-btn-primary">Quero entrar agora</a>
          </div>
          <div className="lp-hero-meta">
            Mensal sem fidelidade <span>·</span> Anual com economia de R$ 864 <span>·</span>{' '}
            Acesso ao arquivo completo
          </div>
        </div>
      </header>

      {/* GANCHO */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-marker" data-num="01 —">O bastidor</div>
          <h2 className="lp-section-title">
            Não o vídeo final. <em>O que vem antes dele.</em>
          </h2>
          <p className="lp-hook-lead">
            Você já se perguntou como é construído um vídeo histórico que para o dedo no Instagram?
          </p>
          <div className="lp-hook-body">
            <p>
              A escolha do tema. A pesquisa de fatos. A arquitetura de 90 segundos. As palavras
              exatas por cena. Os prompts de imagem. A direção cinematográfica. A checagem que
              impede o erro factual. A legenda bilíngue. O texto na tela. As pausas intencionais.
            </p>
            <p>
              Tudo isso vira um documento — um único arquivo — que eu entrego ao meu editor para
              que ele produza o vídeo.
            </p>
            <p>
              <strong>
                Agora esse documento chega na sua área de membros uma hora antes do vídeo ir ao ar
                no @danuzio_history.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* ENTREGÁVEIS */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-marker" data-num="02 —">O que você recebe</div>
          <h2 className="lp-section-title">
            No mínimo <em>8 roteiros completos</em> por mês.
          </h2>
          <p className="lp-hook-body" style={{ maxWidth: '800px' }}>
            Em média, dois roteiros por semana. Sempre que um vídeo entra no ar no @danuzio_history,
            você já recebeu o documento completo uma hora antes. Cada roteiro contém, exatamente
            como entrego para o editor:
          </p>

          <div className="lp-deliverables">
            <div className="lp-deliverable">
              <div className="lp-deliverable-icon">Roteiro</div>
              <h4>Lâmina a lâmina</h4>
              <p>
                Narração cena por cena, com versão em inglês, fala de personagem histórico recriado,
                indicação de cenas POV vs. cenas com personagem, palavras exatas calibradas para 90
                segundos.
              </p>
            </div>
            <div className="lp-deliverable">
              <div className="lp-deliverable-icon">Direção</div>
              <h4>Cinematografia completa</h4>
              <p>
                Composição de cada plano, distância focal, ângulo de câmera, intenção dramática de
                cada corte, paleta cromática, atmosfera.
              </p>
            </div>
            <div className="lp-deliverable">
              <div className="lp-deliverable-icon">Prompts</div>
              <h4>Prontos para IA</h4>
              <p>
                Bloco copia-e-cola para as principais ferramentas de geração de vídeo. Cada prompt
                testado, ajustado e otimizado para o resultado visual final.
              </p>
            </div>
            <div className="lp-deliverable">
              <div className="lp-deliverable-icon">Fatos</div>
              <h4>Checagem completa</h4>
              <p>
                Fontes verificadas, links, contextualização histórica. Você vê exatamente como cada
                afirmação foi confirmada antes de virar narração.
              </p>
            </div>
            <div className="lp-deliverable">
              <div className="lp-deliverable-icon">Visual</div>
              <h4>Tipografia e textos</h4>
              <p>
                O que aparece na tela, em que momento, por quantos segundos, em que fonte. Cada
                elemento gráfico documentado.
              </p>
            </div>
            <div className="lp-deliverable">
              <div className="lp-deliverable-icon">Publicação</div>
              <h4>Kit completo</h4>
              <p>
                Caption bilíngue para Instagram, hashtags otimizadas, timing de comentários nas
                primeiras 60 minutos, estratégia de série.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VANTAGEM DA HORA */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-marker" data-num="03 —">A janela</div>
          <h2 className="lp-section-title">
            A vantagem dos <em>sessenta minutos</em>.
          </h2>

          <div className="lp-advantage">
            <div className="lp-advantage-visual">
              <div className="lp-clock-label">Janela de antecipação</div>
              <div className="lp-clock-number"><em>60</em></div>
              <div className="lp-clock-unit">minutos</div>
              <div className="lp-clock-desc">Antes da publicação no perfil</div>
            </div>

            <div className="lp-advantage-body">
              <p>
                Você abre o material. Lê o roteiro inteiro. Estuda a direção. Analisa os prompts.
                Vê os bastidores da construção.
              </p>
              <p>
                Sessenta minutos depois, o vídeo final entra no ar para o público do
                @danuzio_history.
              </p>
              <p>
                <strong>
                  E você é a única pessoa fora da minha equipe que já sabia, em detalhes, como ele
                  foi montado.
                </strong>
              </p>

              <div className="lp-pull-quote">
                Não é vantagem comercial. É vantagem de aprendizado.
              </div>

              <p>
                Você não está vendo o produto. Está vendo o sistema por trás do produto. E quando
                isso acontece duas vezes por semana, todo mês, você naturalmente absorve um método
                que ninguém ensina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-marker" data-num="04 —">Audiência</div>
          <h2 className="lp-section-title">
            Para quem <em>trabalha com comunicação.</em>
          </h2>
          <p className="lp-hook-body" style={{ maxWidth: '800px' }}>
            Esse produto não é para o fã casual de história. É para quem precisa transformar fatos
            verificados em narrativa que prende a atenção.
          </p>

          <div className="lp-audience">
            <div className="lp-audience-item">
              <h4>Criadores de conteúdo</h4>
              <p>Que querem entender por que alguns formatos viralizam e outros morrem em 800 views.</p>
            </div>
            <div className="lp-audience-item">
              <h4>Jornalistas e podcasters</h4>
              <p>Que querem aprender a transformar fatos verificados em narrativa de 90 segundos.</p>
            </div>
            <div className="lp-audience-item">
              <h4>Professores</h4>
              <p>Que querem ensinar história com a linguagem audiovisual que o aluno consome no Instagram.</p>
            </div>
            <div className="lp-audience-item">
              <h4>Profissionais técnicos</h4>
              <p>Advogados, médicos e especialistas que precisam comunicar conteúdo denso de forma viral.</p>
            </div>
            <div className="lp-audience-item">
              <h4>Marketing e agências</h4>
              <p>Que querem dominar o formato cinematográfico com IA antes de a concorrência aprender.</p>
            </div>
            <div className="lp-audience-item">
              <h4>Estudantes</h4>
              <p>
                De roteiro, cinema e jornalismo que querem ver, em tempo real, o método que faculdade
                nenhuma ensina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INCLUSO */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-marker" data-num="05 —">A assinatura</div>
          <h2 className="lp-section-title">
            O que está <em>incluso</em>.
          </h2>

          <ul className="lp-included-list">
            <li>
              <span className="lp-included-check">◆</span>
              <span className="lp-included-text">
                <strong>No mínimo 8 roteiros completos por mês</strong>, entregues 1 hora antes de
                cada publicação no @danuzio_history.
              </span>
            </li>
            <li>
              <span className="lp-included-check">◆</span>
              <span className="lp-included-text">
                <strong>Acesso ao arquivo histórico</strong> com todos os roteiros publicados desde
                o lançamento da área de membros — Chernobyl, Muro de Berlim, Confisco do Collor,
                Cuba/Castro, Irã 1979, entre outros.
              </span>
            </li>
            <li>
              <span className="lp-included-check">◆</span>
              <span className="lp-included-text">
                <strong>Área de membros exclusiva</strong> com download organizado por data, tema e
                roteiro.
              </span>
            </li>
            <li>
              <span className="lp-included-check">◆</span>
              <span className="lp-included-text">
                <strong>Acesso vitalício aos roteiros baixados</strong> — mesmo se cancelar, fica
                com tudo que recebeu durante a assinatura.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* PLANOS */}
      <section className="lp-section" id="planos">
        <div className="lp-container">
          <div className="lp-section-marker" data-num="06 —">Investimento</div>
          <h2 className="lp-section-title">
            Por que <em>esse preço</em>.
          </h2>

          <div className="lp-price-context">
            <p>
              Cada roteiro que entrego custaria entre <strong>R$ 800 e R$ 2.500</strong> se
              contratado de um roteirista profissional especializado em conteúdo viral.
            </p>
            <p>
              No mínimo oito roteiros por mês representam, no mercado livre,{' '}
              <strong>entre R$ 6.400 e R$ 20.000</strong>.
            </p>
            <p>
              Você acessa esse material por menos de R$ 25 por roteiro no plano mensal — e por menos
              de R$ 16 por roteiro no plano anual. Não é desconto. É outro produto.
            </p>
          </div>

          <div className="lp-plans">
            <div className="lp-plan">
              <div className="lp-plan-label">Plano Mensal</div>
              <h3 className="lp-plan-name">Sem <em>fidelidade</em></h3>
              <div className="lp-plan-price">
                <span className="lp-plan-price-main">R$ 197</span>
                <span className="lp-plan-price-period">/mês</span>
              </div>
              <div className="lp-plan-price-alt">Cancele quando quiser</div>
              <ul className="lp-plan-features">
                <li>Mínimo 8 roteiros completos por mês</li>
                <li>Entrega 1 hora antes da publicação</li>
                <li>Arquivo histórico completo</li>
                <li>Área de membros exclusiva</li>
                <li>Sem multa, sem letra miúda</li>
                <li>Roteiros baixados são seus para sempre</li>
              </ul>
              <a href="#" className="lp-plan-cta">Assinar mensal</a>
            </div>

            <div className="lp-plan featured">
              <div className="lp-plan-label">Plano Anual</div>
              <h3 className="lp-plan-name">Com <em>economia</em></h3>
              <div className="lp-plan-price">
                <span className="lp-plan-price-main">R$ 1.500</span>
                <span className="lp-plan-price-period">/ano</span>
              </div>
              <div className="lp-plan-price-alt">
                ou <strong>12x R$ 152,18</strong> · equivale a R$ 125/mês
              </div>
              <div className="lp-plan-savings">VOCÊ ECONOMIZA R$ 864 POR ANO</div>
              <ul className="lp-plan-features">
                <li>Tudo do plano mensal</li>
                <li>Economia de 37% no ticket mensal</li>
                <li>Menos de R$ 16 por roteiro</li>
                <li>Previsibilidade de 12 meses</li>
                <li>Acesso prioritário a novos formatos</li>
                <li>Migração do mensal abatida no valor</li>
              </ul>
              <a href="#" className="lp-plan-cta">Assinar anual</a>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-marker" data-num="07 —">Quem entrega</div>
          <h2 className="lp-section-title">
            Sobre <em>quem assina</em>.
          </h2>

          <div className="lp-about">
            <div className="lp-about-mark">DN</div>
            <div className="lp-about-text">
              <p>
                Eu sou Danuzio Neto. Construí esse método publicando vídeos no{' '}
                <strong>@danuzio_history</strong> — perfil dedicado exclusivamente a esse formato,
                que cresceu colocando o repórter dentro de Chernobyl, do Muro de Berlim, do Plano
                Collor.
              </p>
              <p>
                Cada vídeo é produzido com IA generativa, voz sintetizada e um sistema de roteiro
                que destilei estudando os perfis cinematográficos que viralizam globalmente.
              </p>
              <p>
                O que entrego nessa área de membros é exatamente o que entrego ao meu editor toda
                semana. Sem versão simplificada, sem material adicional, sem teoria de marketing.{' '}
                <strong>É o documento real que vira o vídeo real.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-marker" data-num="08 —">Compromisso</div>
          <h2 className="lp-section-title">
            Sem letra miúda. <em>Sem pegadinha.</em>
          </h2>

          <div className="lp-guarantee">
            <div className="lp-guarantee-grid">
              <div className="lp-guarantee-item">
                <h4>Plano mensal</h4>
                <p>
                  Sem fidelidade. Cancela em um clique. Sem precisar justificar, sem argumentação,
                  sem retenção. Os roteiros que você baixou continuam seus.
                </p>
              </div>
              <div className="lp-guarantee-item">
                <h4>Plano anual</h4>
                <p>
                  Compromisso de 12 meses em troca da economia de R$ 864 e do preço equivalente de
                  R$ 125/mês. Você se compromete com o ciclo completo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-marker" data-num="09 —">Dúvidas</div>
          <h2 className="lp-section-title">
            Perguntas <em>frequentes</em>.
          </h2>

          <div className="lp-faq">
            {faqs.map((faq, i) => (
              <div key={i} className={`lp-faq-item${openFaq === i ? ' open' : ''}`}>
                <button className="lp-faq-q" onClick={() => toggleFaq(i)}>
                  {faq.q}
                </button>
                <div className="lp-faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-section lp-final-cta">
        <div className="lp-container">
          <h2 className="lp-section-title">Entre no <em>Backstage</em>.</h2>
          <p className="lp-final-cta-sub">
            Uma hora antes do mundo. Toda semana. Por menos de R$ 16 por roteiro.
          </p>
          <div className="lp-final-cta-buttons">
            <a href="#" className="lp-btn-primary">Assinar anual · R$ 1.500</a>
            <a href="#" className="lp-btn-secondary">Assinar mensal · R$ 197/mês</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div className="lp-footer-text">
            © Danuzio History Backstage ·{' '}
            <a href="https://instagram.com/danuzio_history" target="_blank" rel="noreferrer">
              @danuzio_history
            </a>
          </div>
          <div className="lp-footer-text">
            Política de Privacidade · Termos de Uso · Contato
          </div>
        </div>
      </footer>
    </div>
  );
}
