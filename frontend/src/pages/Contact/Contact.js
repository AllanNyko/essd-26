import React, { useState } from 'react';
import './Contact.css';
import colors from '../../config/colors';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulário enviado:', formData);
    // Aqui você pode adicionar a lógica de envio do formulário
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleWhatsAppClick = () => {
    const phone = '5513974116753'; // Código do país + DDD + número
    const message = 'Olá! Vim através do site e gostaria de mais informações.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:green.cortes@gmail.com';
  };

  const contactMethods = [
    {
      id: 1,
      icon: '📧',
      title: 'Email',
      value: 'green.cortes@gmail.com',
      description: 'Responderemos em até 24 horas',
      action: handleEmailClick,
      color: '#1976d2'
    },
    {
      id: 2,
      icon: '💬',
      title: 'WhatsApp',
      value: '(13) 97411-6753',
      description: 'Atendimento rápido e direto',
      action: handleWhatsAppClick,
      color: '#25d366'
    }
  ];

  return (
    <div className="contact" style={{ backgroundColor: colors.background.default }}>
      <div className="contact-container">
        {/* Header */}
        <section className="contact-header">
          <h1 style={{ color: colors.text.primary }}>
            Fale Conosco
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Estamos aqui para ajudar! Entre em contato através de qualquer um dos canais abaixo
          </p>
        </section>

        {/* Métodos de Contato */}
        <section className="contact-methods">
          {contactMethods.map((method) => (
            <div
              key={method.id}
              className="contact-method-card"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider,
              }}
              onClick={method.action}
            >
              <div 
                className="method-icon"
                style={{ backgroundColor: `${method.color}15` }}
              >
                <span>{method.icon}</span>
              </div>
              <h3 style={{ color: colors.text.primary }}>{method.title}</h3>
              <p 
                className="method-value"
                style={{ color: method.color }}
              >
                {method.value}
              </p>
              <p 
                className="method-description"
                style={{ color: colors.text.secondary }}
              >
                {method.description}
              </p>
              <div 
                className="method-action"
                style={{ color: method.color }}
              >
                <span>Clique para contatar</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </section>

        {/* Formulário de Contato */}
        <section className="contact-form-section">
          <div 
            className="form-wrapper"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="form-header">
              <h2 style={{ color: colors.text.primary }}>
                Envie uma Mensagem
              </h2>
              <p style={{ color: colors.text.secondary }}>
                Preencha o formulário abaixo e retornaremos o mais breve possível
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label 
                  htmlFor="name"
                  style={{ color: colors.text.primary }}
                >
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Seu nome"
                  style={{
                    borderColor: colors.divider,
                    color: colors.text.primary,
                    backgroundColor: colors.background.default,
                  }}
                />
              </div>

              <div className="form-group">
                <label 
                  htmlFor="email"
                  style={{ color: colors.text.primary }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                  style={{
                    borderColor: colors.divider,
                    color: colors.text.primary,
                    backgroundColor: colors.background.default,
                  }}
                />
              </div>

              <div className="form-group">
                <label 
                  htmlFor="subject"
                  style={{ color: colors.text.primary }}
                >
                  Assunto *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Qual o motivo do contato?"
                  style={{
                    borderColor: colors.divider,
                    color: colors.text.primary,
                    backgroundColor: colors.background.default,
                  }}
                />
              </div>

              <div className="form-group">
                <label 
                  htmlFor="message"
                  style={{ color: colors.text.primary }}
                >
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Descreva sua dúvida ou solicitação..."
                  style={{
                    borderColor: colors.divider,
                    color: colors.text.primary,
                    backgroundColor: colors.background.default,
                  }}
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                style={{
                  backgroundColor: colors.primary.main,
                  color: colors.primary.contrastText,
                }}
              >
                <span>Enviar Mensagem</span>
                <span>📤</span>
              </button>
            </form>
          </div>
        </section>

        {/* Informações Adicionais */}
        <section className="additional-info">
          <div 
            className="info-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="info-icon">⏰</div>
            <h3 style={{ color: colors.text.primary }}>Horário de Atendimento</h3>
            <p style={{ color: colors.text.secondary }}>
              Segunda a Sexta: 9h às 18h<br />
              Sábado: 9h às 13h
            </p>
          </div>

          <div 
            className="info-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="info-icon">⚡</div>
            <h3 style={{ color: colors.text.primary }}>Resposta Rápida</h3>
            <p style={{ color: colors.text.secondary }}>
              Tempo médio de resposta:<br />
              Email: 24h | WhatsApp: 2h
            </p>
          </div>

          <div 
            className="info-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="info-icon">🛡️</div>
            <h3 style={{ color: colors.text.primary }}>Privacidade</h3>
            <p style={{ color: colors.text.secondary }}>
              Suas informações estão<br />
              seguras e protegidas
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
