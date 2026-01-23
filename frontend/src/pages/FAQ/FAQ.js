import React, { useState } from 'react';
import './FAQ.css';
import colors from '../../config/colors';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      category: '💳 Planos e Pagamentos',
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceitamos cartão de crédito (Visa, Mastercard, Elo, American Express), cartão de débito, boleto bancário e PIX. O pagamento é processado de forma segura através de nossa plataforma.'
    },
    {
      id: 2,
      category: '💳 Planos e Pagamentos',
      question: 'Posso cancelar minha assinatura a qualquer momento?',
      answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou multas. O acesso continuará até o final do período pago.'
    },
    {
      id: 3,
      category: '💳 Planos e Pagamentos',
      question: 'Como faço upgrade ou downgrade do meu plano?',
      answer: 'Acesse sua conta, vá em "Planos" e selecione o novo plano desejado. O ajuste será feito proporcionalmente ao tempo restante do seu plano atual.'
    },
    {
      id: 4,
      category: '💳 Planos e Pagamentos',
      question: 'Há período de teste grátis?',
      answer: 'Sim! Todos os planos pagos oferecem 7 dias de garantia. Se não estiver satisfeito, devolvemos 100% do valor pago.'
    },
    {
      id: 5,
      category: '🚀 Funcionalidades',
      question: 'Como adicionar novos projetos?',
      answer: 'No painel principal, clique no botão "Novo Projeto" e preencha as informações básicas. Você pode adicionar colaboradores, definir metas e acompanhar o progresso em tempo real.'
    },
    {
      id: 6,
      category: '🚀 Funcionalidades',
      question: 'Posso compartilhar projetos com minha equipe?',
      answer: 'Sim! Nos planos Basic e superiores, você pode adicionar colaboradores aos seus projetos. No plano Enterprise, não há limite de usuários.'
    },
    {
      id: 7,
      category: '🚀 Funcionalidades',
      question: 'Os dados são sincronizados entre dispositivos?',
      answer: 'Sim! Todos os seus dados são sincronizados automaticamente entre todos os dispositivos. Você pode acessar do celular, tablet ou computador.'
    },
    {
      id: 8,
      category: '🚀 Funcionalidades',
      question: 'Como funcionam os relatórios?',
      answer: 'Os relatórios são gerados automaticamente com base nas suas atividades. Você pode exportar em PDF ou Excel e personalizar os filtros conforme necessário.'
    },
    {
      id: 9,
      category: '🔒 Segurança e Privacidade',
      question: 'Meus dados estão seguros?',
      answer: 'Sim! Utilizamos criptografia SSL/TLS em todas as comunicações e armazenamos dados em servidores seguros com backup diário. Cumprimos com a LGPD.'
    },
    {
      id: 10,
      category: '🔒 Segurança e Privacidade',
      question: 'Vocês compartilham meus dados com terceiros?',
      answer: 'Não! Seus dados são exclusivamente seus. Não vendemos, alugamos ou compartilhamos informações pessoais com terceiros para fins comerciais.'
    },
    {
      id: 11,
      category: '🔒 Segurança e Privacidade',
      question: 'Como faço backup dos meus dados?',
      answer: 'Fazemos backup automático diário. Nos planos Pro e Enterprise, você também pode fazer backup manual e exportar todos os seus dados a qualquer momento.'
    },
    {
      id: 12,
      category: '💬 Suporte',
      question: 'Qual o horário de atendimento do suporte?',
      answer: 'Nosso suporte funciona de segunda a sexta, das 9h às 18h. Planos Pro e Enterprise têm suporte 24/7 via chat e email.'
    },
    {
      id: 13,
      category: '💬 Suporte',
      question: 'Como entro em contato com o suporte?',
      answer: 'Você pode nos contatar via email (green.cortes@gmail.com), WhatsApp (13) 97411-6753 ou através do chat online disponível no canto inferior direito.'
    },
    {
      id: 14,
      category: '💬 Suporte',
      question: 'Oferecem treinamento para novos usuários?',
      answer: 'Sim! Temos tutoriais em vídeo, documentação completa e webinars mensais gratuitos. Planos Enterprise incluem treinamento personalizado.'
    },
    {
      id: 15,
      category: '⚙️ Técnico',
      question: 'Quais navegadores são suportados?',
      answer: 'Suportamos as versões mais recentes do Chrome, Firefox, Safari e Edge. Para melhor experiência, recomendamos Chrome ou Firefox.'
    },
    {
      id: 16,
      category: '⚙️ Técnico',
      question: 'Existe aplicativo mobile?',
      answer: 'Sim! Temos aplicativos para iOS e Android disponíveis na App Store e Google Play. A aplicação web também é responsiva e funciona perfeitamente no celular.'
    },
    {
      id: 17,
      category: '⚙️ Técnico',
      question: 'Posso integrar com outras ferramentas?',
      answer: 'Sim! Nos planos Pro e Enterprise, oferecemos integrações com Slack, Google Drive, Trello, e muitas outras ferramentas via API.'
    },
    {
      id: 18,
      category: '⚙️ Técnico',
      question: 'Funciona offline?',
      answer: 'Sim! Como PWA, a aplicação funciona offline. As alterações são sincronizadas automaticamente quando você retorna online.'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <div className="faq" style={{ backgroundColor: colors.background.default }}>
      <div className="faq-container">
        {/* Header */}
        <section className="faq-header">
          <h1 style={{ color: colors.text.primary }}>
            Perguntas Frequentes
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Encontre respostas rápidas para as dúvidas mais comuns
          </p>
        </section>

        {/* Stats */}
        <section className="faq-stats">
          <div 
            className="stat-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="stat-icon">📚</div>
            <div className="stat-value" style={{ color: colors.text.primary }}>
              {faqs.length}
            </div>
            <div className="stat-label" style={{ color: colors.text.secondary }}>
              Perguntas
            </div>
          </div>

          <div 
            className="stat-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="stat-icon">🎯</div>
            <div className="stat-value" style={{ color: colors.text.primary }}>
              {Object.keys(groupedFAQs).length}
            </div>
            <div className="stat-label" style={{ color: colors.text.secondary }}>
              Categorias
            </div>
          </div>

          <div 
            className="stat-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="stat-icon">⚡</div>
            <div className="stat-value" style={{ color: colors.text.primary }}>
              24h
            </div>
            <div className="stat-label" style={{ color: colors.text.secondary }}>
              Resposta Média
            </div>
          </div>
        </section>

        {/* FAQs List */}
        <section className="faq-list">
          {Object.keys(groupedFAQs).length > 0 ? (
            Object.entries(groupedFAQs).map(([category, questions]) => (
              <div key={category} className="faq-category">
                <h2 
                  className="category-title"
                  style={{ color: colors.text.primary }}
                >
                  {category}
                </h2>
                
                <div className="questions-list">
                  {questions.map((faq) => (
                    <div
                      key={faq.id}
                      className={`faq-item ${expandedId === faq.id ? 'expanded' : ''}`}
                      style={{
                        backgroundColor: colors.background.paper,
                        borderColor: colors.divider,
                      }}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleExpand(faq.id)}
                        style={{ color: colors.text.primary }}
                      >
                        <span className="question-text">{faq.question}</span>
                        <span 
                          className="expand-icon"
                          style={{ color: colors.primary.main }}
                        >
                          {expandedId === faq.id ? '−' : '+'}
                        </span>
                      </button>
                      
                      {expandedId === faq.id && (
                        <div 
                          className="faq-answer"
                          style={{ 
                            color: colors.text.secondary,
                            borderTopColor: colors.divider
                          }}
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div 
              className="no-results"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider,
              }}
            >
              <div className="no-results-icon">🔍</div>
              <h3 style={{ color: colors.text.primary }}>
                Nenhum resultado encontrado
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Tente usar outros termos de busca ou entre em contato conosco
              </p>
            </div>
          )}
        </section>

        {/* Search Bar - Fixed at Bottom */}
        <div className="search-bar-fixed">
          <div 
            className="search-bar-container"
            style={{
              backgroundColor: colors.background.paper,
              boxShadow: `0 -4px 20px rgba(0, 0, 0, 0.15)`,
            }}
          >
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar perguntas frequentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  color: colors.text.primary,
                  backgroundColor: colors.background.default,
                  borderColor: colors.divider,
                }}
              />
              {searchTerm && (
                <button
                  className="clear-button"
                  onClick={() => setSearchTerm('')}
                  style={{ color: colors.text.secondary }}
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <div 
                className="search-results-count"
                style={{ color: colors.text.secondary }}
              >
                {filteredFAQs.length} resultado{filteredFAQs.length !== 1 ? 's' : ''} encontrado{filteredFAQs.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
