import React, { useState } from 'react';
import './MaterialsView.css';
import colors from '../../config/colors';

const MaterialsView = ({ type = 'apostilas', onBack }) => {
  const [selectedSubject, setSelectedSubject] = useState('');

  // Configurações específicas por tipo
  const configs = {
    apostilas: {
      title: 'Apostilas',
      subtitle: 'Material Didático Completo',
      icon: '📚',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bannerImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=400&fit=crop'
    },
    resumos: {
      title: 'Resumos',
      subtitle: 'Sínteses Objetivas',
      icon: '📝',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bannerImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=400&fit=crop'
    },
    mapas: {
      title: 'Mapas Mentais',
      subtitle: 'Visualização Inteligente',
      icon: '🧠',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bannerImage: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=400&fit=crop'
    }
  };

  const config = configs[type] || configs.apostilas;

  const subjects = [
    { id: 'matematica', name: 'Matemática' },
    { id: 'portugues', name: 'Português' },
    { id: 'fisica', name: 'Física' },
    { id: 'quimica', name: 'Química' },
    { id: 'biologia', name: 'Biologia' },
    { id: 'historia', name: 'História' },
    { id: 'geografia', name: 'Geografia' },
    { id: 'ingles', name: 'Inglês' },
    { id: 'literatura', name: 'Literatura' },
    { id: 'filosofia', name: 'Filosofia' }
  ];

  // Dados mockados dos materiais
  const materials = [
    {
      id: 'MAT-001',
      title: 'Funções Trigonométricas - Completo',
      subject: 'matematica',
      uploader: 'Prof. Carlos Silva',
      uploadDate: '15/01/2026',
      downloads: 234,
      rating: 4.8,
      pages: 45,
      thumbnail: '📐'
    },
    {
      id: 'MAT-002',
      title: 'Geometria Analítica - Fundamentos',
      subject: 'matematica',
      uploader: 'Ana Paula Costa',
      uploadDate: '12/01/2026',
      downloads: 189,
      rating: 4.6,
      pages: 32,
      thumbnail: '📏'
    },
    {
      id: 'MAT-003',
      title: 'Limites e Derivadas - Introdução',
      subject: 'matematica',
      uploader: 'Prof. Roberto Lima',
      uploadDate: '10/01/2026',
      downloads: 312,
      rating: 4.9,
      pages: 52,
      thumbnail: '∞'
    },
    {
      id: 'PORT-001',
      title: 'Análise Sintática - Guia Completo',
      subject: 'portugues',
      uploader: 'Prof. Marina Santos',
      uploadDate: '14/01/2026',
      downloads: 156,
      rating: 4.7,
      pages: 38,
      thumbnail: '✍️'
    },
    {
      id: 'PORT-002',
      title: 'Figuras de Linguagem',
      subject: 'portugues',
      uploader: 'João Pedro Alves',
      uploadDate: '11/01/2026',
      downloads: 198,
      rating: 4.5,
      pages: 28,
      thumbnail: '📖'
    },
    {
      id: 'FIS-001',
      title: 'Mecânica Clássica - Leis de Newton',
      subject: 'fisica',
      uploader: 'Prof. Eduardo Martins',
      uploadDate: '13/01/2026',
      downloads: 267,
      rating: 4.8,
      pages: 48,
      thumbnail: '⚛️'
    },
    {
      id: 'FIS-002',
      title: 'Eletromagnetismo - Conceitos Básicos',
      subject: 'fisica',
      uploader: 'Dra. Fernanda Rocha',
      uploadDate: '09/01/2026',
      downloads: 223,
      rating: 4.6,
      pages: 41,
      thumbnail: '⚡'
    },
    {
      id: 'QUIM-001',
      title: 'Química Orgânica - Introdução',
      subject: 'quimica',
      uploader: 'Prof. Ricardo Souza',
      uploadDate: '16/01/2026',
      downloads: 178,
      rating: 4.7,
      pages: 36,
      thumbnail: '🧪'
    }
  ];

  const filteredMaterials = selectedSubject
    ? materials.filter(m => m.subject === selectedSubject)
    : materials;

  const handleMaterialClick = (material) => {
    console.log('Material clicado:', material);
    alert(`Abrindo: ${material.title}\nID: ${material.id}`);
  };

  return (
    <div className="materials-view" style={{ backgroundColor: colors.background.default }}>
      {/* Banner com Imagem de Fundo */}
      <div 
        className="materials-banner"
        style={{ background: config.gradient }}
      >
        <div className="banner-overlay" />
        
        {/* Botão Voltar */}
        {onBack && (
          <button
            className="back-button"
            onClick={onBack}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span>←</span>
            <span>Voltar</span>
          </button>
        )}
        
        <div className="banner-content">
          <div className="banner-icon">{config.icon}</div>
          <h1>{config.title}</h1>
          <p>{config.subtitle}</p>
        </div>
        <div className="banner-decoration">
          <div className="decoration-circle circle-1" />
          <div className="decoration-circle circle-2" />
          <div className="decoration-circle circle-3" />
        </div>
      </div>

      <div className="materials-container">
        {/* Filtro de Matéria */}
        <section className="filter-section">
          <div 
            className="filter-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="filter-header">
              <span className="filter-icon">🎯</span>
              <div className="filter-info">
                <label 
                  htmlFor="subject-select"
                  style={{ color: colors.text.primary }}
                >
                  Selecione a Matéria
                </label>
                <p style={{ color: colors.text.secondary }}>
                  {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material disponível' : 'materiais disponíveis'}
                </p>
              </div>
            </div>

            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-select"
              style={{
                borderColor: colors.divider,
                color: colors.text.primary,
                backgroundColor: colors.background.default,
              }}
            >
              <option value="">Todas as Matérias</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Lista de Materiais */}
        <section className="materials-list">
          {filteredMaterials.length > 0 ? (
            <div className="materials-grid">
              {filteredMaterials.map((material) => (
                <div
                  key={material.id}
                  className="material-card"
                  onClick={() => handleMaterialClick(material)}
                  style={{
                    backgroundColor: colors.background.paper,
                    borderColor: colors.divider,
                  }}
                >
                  {/* Content */}
                  <div className="material-content">
                    <div className="material-header">
                      <h3 style={{ color: colors.text.primary }}>
                        {material.title}
                      </h3>
                      <div 
                        className="material-id"
                        style={{ 
                          color: colors.text.secondary,
                          backgroundColor: colors.background.default
                        }}
                      >
                        ID: {material.id}
                      </div>
                    </div>

                    <div className="material-meta">
                      <div className="meta-item">
                        <span className="meta-icon">👤</span>
                        <span style={{ color: colors.text.secondary }}>
                          {material.uploader}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span style={{ color: colors.text.secondary }}>
                          {material.uploadDate}
                        </span>
                      </div>
                    </div>

                    <div className="material-stats">
                      <div className="stat-item">
                        <span className="stat-icon">📄</span>
                        <span style={{ color: colors.text.secondary }}>
                          {material.pages} páginas
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">⬇️</span>
                        <span style={{ color: colors.text.secondary }}>
                          {material.downloads}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">⭐</span>
                        <span style={{ color: colors.text.secondary }}>
                          {material.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              className="empty-state"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider,
              }}
            >
              <div className="empty-icon">📭</div>
              <h3 style={{ color: colors.text.primary }}>
                Nenhum material encontrado
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Não há materiais disponíveis para a matéria selecionada.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MaterialsView;
