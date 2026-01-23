import React, { useState } from 'react';
import colors from '../../config/colors';
import './Community.css';

function Community() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedMaterialType, setSelectedMaterialType] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [file, setFile] = useState(null);
  
  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizAnswers, setQuizAnswers] = useState(['', '', '', '']);

  const subjects = [
    'Matemática',
    'Português',
    'História',
    'Geografia',
    'Ciências',
    'Física',
    'Química',
    'Biologia',
    'Inglês',
    'Filosofia',
    'Sociologia',
    'Artes'
  ];

  const materialTypes = [
    { id: 'mapas', name: 'Mapas Mentais', icon: '🗺️' },
    { id: 'resumos', name: 'Resumos', icon: '📝' },
    { id: 'quiz', name: 'Questões de Quiz', icon: '❓' }
  ];

  // Mock data for validation
  const [materialsToValidate] = useState([
    {
      id: 1,
      title: 'Mapa Mental - Fotossíntese',
      type: 'Mapa Mental',
      subject: 'Biologia',
      validations: 1,
      totalNeeded: 3
    },
    {
      id: 2,
      title: 'Resumo - Segunda Guerra Mundial',
      type: 'Resumo',
      subject: 'História',
      validations: 2,
      totalNeeded: 3
    },
    {
      id: 3,
      title: 'Quiz - Equações do 2º Grau',
      type: 'Quiz',
      subject: 'Matemática',
      validations: 0,
      totalNeeded: 3
    }
  ]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleQuizAnswerChange = (index, value) => {
    const newAnswers = [...quizAnswers];
    newAnswers[index] = value;
    setQuizAnswers(newAnswers);
  };

  const handleGradeChange = (value) => {
    // Remove caracteres não numéricos exceto ponto
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    // Permite apenas um ponto decimal
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limita a 2 casas decimais
    if (parts[1] && parts[1].length > 2) {
      numericValue = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    // Converte para número para validar range
    const num = parseFloat(numericValue);
    
    // Se o valor for maior que 10, limita a 10
    if (num > 10) {
      setGrade('10');
      return;
    }
    
    // Se o valor for menor que 0, limita a 0
    if (numericValue !== '' && num < 0) {
      setGrade('0');
      return;
    }
    
    setGrade(numericValue);
  };

  const handleSubmitMaterial = () => {
    if (selectedMaterialType === 'quiz') {
      if (quizQuestion && quizAnswers.every(a => a)) {
        alert('Questão enviada com sucesso! Aguardando validação de 3 usuários.');
        setQuizQuestion('');
        setQuizAnswers(['', '', '', '']);
        setSelectedMaterialType(null);
      } else {
        alert('Por favor, preencha a questão e todas as respostas.');
      }
    } else {
      if (file && selectedSubject) {
        alert('Material enviado com sucesso! Aguardando validação de 3 usuários.');
        setFile(null);
        setSelectedSubject('');
        setSelectedMaterialType(null);
      } else {
        alert('Por favor, selecione um arquivo e uma matéria.');
      }
    }
  };

  const handleValidate = (materialId) => {
    alert(`Material ${materialId} validado com sucesso!`);
  };

  const handleReject = (materialId) => {
    alert(`Material ${materialId} rejeitado.`);
  };

  const handleViewMaterial = (materialId) => {
    alert(`Visualizando material ${materialId}. Em breve será possível ver o conteúdo completo.`);
  };

  const handleSubmitGrade = () => {
    const gradeValue = parseFloat(grade);
    
    if (!selectedSubject) {
      alert('Por favor, selecione uma matéria.');
      return;
    }
    
    if (grade === '' || isNaN(gradeValue)) {
      alert('Por favor, insira uma nota válida.');
      return;
    }
    
    if (gradeValue < 0 || gradeValue > 10) {
      alert('A nota deve ser um valor entre 0 e 10.');
      return;
    }
    
    alert(`Nota ${gradeValue.toFixed(2)} registrada para ${selectedSubject}!`);
    setSelectedSubject('');
    setGrade('');
  };

  const renderModuleContent = () => {
    switch (selectedModule) {
      case 'enviar':
        return (
          <div className="community-page">
            <div className="community-content">
              <div className="material-banner">
                <div className="material-banner-content">
                  <h2>Envie materiais para a comunidade</h2>
                  <p>Compartilhe mapas mentais, resumos ou questões. Seu conteúdo passa por validação colaborativa para manter a qualidade.</p>
                </div>
              </div>

              <div className="module-header">
                <button className="back-button-community" onClick={() => setSelectedModule(null)} style={{
                  borderColor: colors.primary.main,
                  color: colors.primary.main
                }}>
                  ← Voltar
                </button>
                <div>
                  <h2 style={{ color: colors.text.primary }}>Enviar Materiais</h2>
                  <p style={{ color: colors.text.secondary }}>Compartilhe conteúdos educacionais com a comunidade</p>
                </div>
              </div>
            
              {!selectedMaterialType ? (
                <div className="material-types-container">
                  <div className="material-types-grid">
                    {materialTypes.map(type => (
                      <div
                        key={type.id}
                        className="material-type-card"
                        onClick={() => setSelectedMaterialType(type.id)}
                        data-type={type.id}
                      >
                        <div className="material-card-content">
                          <h3>{type.name}</h3>
                          <p>
                            {type.id === 'mapas' && 'Organize conceitos visualmente'}
                            {type.id === 'resumos' && 'Compartilhe resumos de estudo'}
                            {type.id === 'quiz' && 'Crie questões para praticar'}
                          </p>
                        </div>
                        <div className="material-card-icon">
                          {type.icon}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedMaterialType === 'quiz' ? (
                <div className="quiz-form-container">
                  <button 
                    className="back-button-community small" 
                    onClick={() => setSelectedMaterialType(null)}
                    style={{
                      borderColor: colors.text.secondary,
                      color: colors.text.secondary,
                      marginBottom: '24px'
                    }}
                  >
                    ← Escolher outro tipo
                  </button>
                  <div className="quiz-form">
                    <div className="form-group">
                      <label style={{ color: colors.text.primary, fontWeight: '600' }}>
                        Matéria
                      </label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={{
                          borderColor: colors.divider,
                          backgroundColor: colors.background.paper,
                          color: colors.text.primary
                        }}
                      >
                        <option value="">Selecione a matéria</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label style={{ color: colors.text.primary, fontWeight: '600' }}>
                        Questão
                      </label>
                      <textarea
                        value={quizQuestion}
                        onChange={(e) => setQuizQuestion(e.target.value)}
                        placeholder="Digite a questão do quiz..."
                        rows="4"
                        style={{
                          borderColor: colors.divider,
                          backgroundColor: colors.background.paper,
                          color: colors.text.primary
                        }}
                      />
                    </div>
                    <div className="answers-section" style={{
                      backgroundColor: colors.background.default,
                      border: `1px solid ${colors.divider}`
                    }}>
                      <div className="answers-header">
                        <h3 style={{ color: colors.text.primary, fontSize: '16px' }}>Respostas</h3>
                        <p style={{ color: colors.text.secondary, fontSize: '12px' }}>A primeira resposta é a correta</p>
                      </div>
                      {quizAnswers.map((answer, index) => (
                        <div key={index} className="form-group">
                          <label style={{ color: colors.text.primary }}>
                            <span className={`answer-badge ${index === 0 ? 'correct' : 'incorrect'}`}>
                              {index === 0 ? '✓' : index + 1}
                            </span>
                            Resposta {index + 1} {index === 0 && '(CORRETA)'}
                          </label>
                          <input
                            type="text"
                            value={answer}
                            onChange={(e) => handleQuizAnswerChange(index, e.target.value)}
                            placeholder={`Resposta ${index + 1}`}
                            className={`answer-input ${index === 0 ? 'correct-answer' : 'incorrect-answer'}`}
                            style={{
                              borderColor: index === 0 ? colors.success.main : colors.divider,
                              backgroundColor: colors.background.paper,
                              color: colors.text.primary
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button 
                      className="submit-button" 
                      onClick={handleSubmitMaterial}
                      disabled={!selectedSubject || !quizQuestion || !quizAnswers.every(a => a.trim())}
                      style={{
                        backgroundColor: (!selectedSubject || !quizQuestion || !quizAnswers.every(a => a.trim())) 
                          ? colors.divider 
                          : colors.primary.main,
                        color: '#ffffff',
                        cursor: (!selectedSubject || !quizQuestion || !quizAnswers.every(a => a.trim())) 
                          ? 'not-allowed' 
                          : 'pointer',
                        opacity: (!selectedSubject || !quizQuestion || !quizAnswers.every(a => a.trim())) 
                          ? 0.6 
                          : 1
                      }}
                    >
                      Enviar Questão
                    </button>
                  </div>
                </div>
              ) : (
                <div className="upload-container">
                  <button 
                    className="back-button-community small" 
                    onClick={() => setSelectedMaterialType(null)}
                    style={{
                      borderColor: colors.text.secondary,
                      color: colors.text.secondary,
                      marginBottom: '24px'
                    }}
                  >
                    ← Escolher outro tipo
                  </button>
                  <div className="upload-form">
                    <div className="form-group">
                      <label style={{ color: colors.text.primary, fontWeight: '600' }}>
                        Matéria
                      </label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={{
                          borderColor: colors.divider,
                          backgroundColor: colors.background.paper,
                          color: colors.text.primary
                        }}
                      >
                        <option value="">Selecione a matéria</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    <div 
                      className="upload-area"
                      style={{
                        border: `2px dashed ${colors.primary.main}`,
                        backgroundColor: file ? colors.primary.light : colors.background.paper,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        accept=".pdf,image/*"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-upload" className="upload-label">
                        <div className="upload-icon" style={{ 
                          color: colors.primary.main,
                          fontSize: file ? '48px' : '56px'
                        }}>
                          {file ? '✓' : '⬆'}
                        </div>
                        <div>
                          <p className="upload-text" style={{ 
                            color: colors.text.primary,
                            fontWeight: '600'
                          }}>
                            {file ? file.name : 'Clique ou arraste o arquivo aqui'}
                          </p>
                          <p className="upload-hint" style={{ color: colors.text.secondary }}>
                            {file ? 'Arquivo selecionado' : 'PDF ou Imagem (PNG, JPG) - Máx. 10MB'}
                          </p>
                        </div>
                      </label>
                    </div>
                    <button 
                      className="submit-button" 
                      onClick={handleSubmitMaterial}
                      disabled={!selectedSubject || !file}
                      style={{
                        backgroundColor: (!selectedSubject || !file) 
                          ? colors.divider 
                          : colors.primary.main,
                        color: '#ffffff',
                        cursor: (!selectedSubject || !file) 
                          ? 'not-allowed' 
                          : 'pointer',
                        opacity: (!selectedSubject || !file) 
                          ? 0.6 
                          : 1
                      }}
                    >
                      Enviar Material
                    </button>
                  </div>
                </div>
              )}
              
              <div className="info-box" style={{
                padding: '16px 20px',
                backgroundColor: colors.background.paper,
                border: `1px solid ${colors.divider}`,
                borderRadius: '12px',
                marginTop: '32px'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: colors.text.secondary,
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}>
                  💡 Seu material será publicado após validação de 3 usuários diferentes.
                </p>
              </div>
            </div>
          </div>
        );

      case 'validar':
        return (
          <div className="community-page">
            <div className="community-content">
              <div className="module-header">
                <button className="back-button-community" onClick={() => setSelectedModule(null)} style={{
                  borderColor: colors.primary.main,
                  color: colors.primary.main
                }}>
                  ← Voltar
                </button>
                <div>
                  <h2 style={{ color: colors.text.primary }}>Validar Materiais</h2>
                  <p style={{ color: colors.text.secondary }}>Ajude a validar conteúdos enviados pela comunidade</p>
                </div>
              </div>
              
              <div className="validation-container">
                <div className="validation-list">
                  {materialsToValidate.map(material => (
                    <div 
                      key={material.id} 
                      className="validation-card"
                      style={{
                        borderColor: colors.divider,
                        backgroundColor: colors.background.paper
                      }}
                    >
                      <div className="validation-header">
                        <div className="validation-info">
                          <h3 style={{ color: colors.text.primary }}>{material.title}</h3>
                          <div className="validation-meta">
                            <span style={{
                              padding: '4px 12px',
                              backgroundColor: '#ffffff',
                              color: colors.primary.main,
                              border: `2px solid ${colors.primary.main}`,
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {material.type}
                            </span>
                            <span style={{ 
                              color: colors.text.secondary,
                              fontSize: '14px'
                            }}>
                              {material.subject}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className="validation-progress"
                        style={{ backgroundColor: colors.background.default }}
                      >
                        <div className="progress-header">
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600',
                            color: colors.text.primary
                          }}>
                            Progresso de Validação
                          </span>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '700',
                            color: colors.primary.main
                          }}>
                            {material.validations}/{material.totalNeeded}
                          </span>
                        </div>
                        <div 
                          className="progress-bar-bg"
                          style={{ borderColor: colors.divider }}
                        >
                          <div 
                            className="progress-bar-fill" 
                            style={{ 
                              width: `${(material.validations / material.totalNeeded) * 100}%`,
                              backgroundColor: colors.success.main
                            }}
                          />
                        </div>
                        <p className="progress-hint" style={{ color: colors.text.secondary }}>
                          {material.validations === 0 && 'Seja o primeiro a validar este material'}
                          {material.validations === 1 && 'Faltam 2 validações para publicação'}
                          {material.validations === 2 && 'Falta 1 validação para publicação'}
                        </p>
                      </div>
                      
                      <div className="validation-actions" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '8px',
                        width: '100%'
                      }}>
                        <button 
                          className="action-button"
                          onClick={() => handleViewMaterial(material.id)}
                          style={{
                            borderColor: colors.primary.main,
                            color: colors.primary.main,
                            backgroundColor: 'transparent',
                            padding: '10px 12px',
                            fontSize: '13px'
                          }}
                        >
                          Visualizar
                        </button>
                        <button 
                          className="action-button"
                          onClick={() => handleReject(material.id)}
                          style={{
                            borderColor: colors.error.main,
                            color: colors.error.main,
                            backgroundColor: 'transparent',
                            padding: '10px 12px',
                            fontSize: '13px'
                          }}
                        >
                          Rejeitar
                        </button>
                        <button 
                          className="action-button"
                          onClick={() => handleValidate(material.id)}
                          style={{
                            gridColumn: '1 / -1',
                            borderColor: colors.success.main,
                            color: colors.success.main,
                            backgroundColor: 'transparent',
                            padding: '10px 12px',
                            fontSize: '13px'
                          }}
                        >
                          Aprovar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="info-box" style={{
                padding: '16px 20px',
                backgroundColor: colors.primary.light,
                borderRadius: '12px',
                marginTop: '32px'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: colors.primary.main,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Valide materiais enviados por outros usuários. São necessárias 3 validações para publicação.
                </p>
              </div> */}
            </div>
          </div>
        );

      case 'nota':
        return (
          <div className="community-page">
            <div className="community-content">
              <div className="module-header">
                <button className="back-button-community" onClick={() => setSelectedModule(null)} style={{
                  borderColor: colors.primary.main,
                  color: colors.primary.main
                }}>
                  ← Voltar
                </button>
                <div>
                  <h2 style={{ color: colors.text.primary }}>Inserir Nota</h2>
                  <p style={{ color: colors.text.secondary }}>Registre e acompanhe suas notas</p>
                </div>
              </div>
              
              <div className="grades-form">
                <div 
                  className="grades-card"
                  style={{
                    border: `2px solid ${colors.divider}`,
                    backgroundColor: colors.background.paper
                  }}
                >
                  <div className="form-group">
                    <label style={{ 
                      color: colors.text.primary,
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Matéria *
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      style={{
                        borderColor: colors.divider,
                        backgroundColor: colors.background.paper,
                        color: colors.text.primary,
                        fontSize: '15px'
                      }}
                    >
                      <option value="">Selecione uma matéria</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label style={{ 
                      color: colors.text.primary,
                      fontWeight: '600',
                      fontSize: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>Nota (0 a 10) *</span>
                      {grade && (
                        <span style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: parseFloat(grade) >= 7 ? colors.success.main : 
                                 parseFloat(grade) >= 5 ? colors.warning.main : 
                                 colors.error.main
                        }}>
                          {parseFloat(grade).toFixed(1)}
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={grade}
                      onChange={(e) => handleGradeChange(e.target.value)}
                      placeholder="Ex: 8.5"
                      style={{
                        borderColor: grade ? 
                          (parseFloat(grade) >= 7 ? colors.success.main : 
                           parseFloat(grade) >= 5 ? colors.warning.main : 
                           colors.error.main) : colors.divider,
                        backgroundColor: colors.background.paper,
                        color: colors.text.primary,
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    />
                  </div>
                  
                  {grade && selectedSubject && (
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: colors.background.default,
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}>
                      <p style={{ 
                        margin: 0,
                        fontSize: '13px',
                        color: colors.text.secondary,
                        lineHeight: '1.5'
                      }}>
                        📊 Você está registrando <strong>{parseFloat(grade).toFixed(1)}</strong> em <strong>{selectedSubject}</strong>
                      </p>
                    </div>
                  )}
                  
                  <button 
                    className="submit-button" 
                    onClick={handleSubmitGrade}
                    disabled={!selectedSubject || !grade}
                    style={{
                      backgroundColor: (!selectedSubject || !grade) ? colors.divider : colors.primary.main,
                      color: '#ffffff',
                      cursor: (!selectedSubject || !grade) ? 'not-allowed' : 'pointer',
                      opacity: (!selectedSubject || !grade) ? 0.6 : 1
                    }}
                  >
                    Registrar Nota
                  </button>
                </div>
              </div>

              <div className="info-box" style={{
                padding: '16px 20px',
                backgroundColor: colors.background.paper,
                border: `1px solid ${colors.divider}`,
                borderRadius: '12px',
                marginTop: '24px'
              }}>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  color: colors.text.primary,
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  💡 Dica
                </p>
                <p style={{ 
                  margin: 0, 
                  color: colors.text.secondary,
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}>
                  Registre suas notas regularmente para acompanhar seu progresso e identificar matérias que precisam de mais atenção.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedModule) {
    return (
      <div className="community-page">
        {renderModuleContent()}
      </div>
    );
  }

  return (
    <div className="community-page">
      <div className="community-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content-community">
          <h1>Comunidade</h1>
          <p>Contribua e valide materiais de estudo compartilhados pela comunidade</p>
        </div>
      </div>

      <div className="modules-section">
        <div className="modules-grid">
          <div className="module-card" onClick={() => setSelectedModule('enviar')} style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <div className="module-overlay"></div>
            <div className="module-content-card">
              <h2>Enviar Materiais</h2>
              <p>Compartilhe mapas mentais, resumos e questões de quiz com a comunidade</p>
            </div>
          </div>

          <div className="module-card" onClick={() => setSelectedModule('validar')} style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          }}>
            <div className="module-overlay"></div>
            <div className="module-content-card">
              <h2>Validar Materiais</h2>
              <p>Revise e aprove conteúdos enviados por outros estudantes</p>
            </div>
          </div>

          <div className="module-card" onClick={() => setSelectedModule('nota')} style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }}>
            <div className="module-overlay"></div>
            <div className="module-content-card">
              <h2>Inserir Nota</h2>
              <p>Registre suas notas e acompanhe seu desempenho acadêmico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
