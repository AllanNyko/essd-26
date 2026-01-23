import React, { useEffect, useState } from 'react';
import './Profile.css';
import colors from '../../config/colors';
import { getCurrentUser, updateProfile } from '../../services/authService';

const formatPhone = (value) => {
  const digits = (value || '').replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatMemberSince = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

const formatPrice = (price, currency = 'BRL') => {
  if (Number(price) === 0) return 'Grátis';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(Number(price || 0));
};

const formatPeriod = (days) => {
  if (!days) return '';
  return `/${days} dias`;
};

const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR');
};

const Profile = ({ onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '—',
    birthDate: '',
    address: '—',
    memberSince: '—',
    plan: null,
    planExpiresAt: null,
    avatarUrl: null,
  });
  const [originalData, setOriginalData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getCurrentUser();
        if (response?.success && response.data?.user) {
          const user = response.data.user;
          const formattedUserData = {
            name: user.name || '',
            email: user.email || '',
            phone: formatPhone(user.phone || ''),
            cpf: '—',
            birthDate: '—',
            address: '—',
            memberSince: formatMemberSince(user.created_at),
            plan: user.plan || null,
            planExpiresAt: user.plan_expires_at || null,
            avatarUrl: user.avatar_url || null,
          };
          setUserData(formattedUserData);
          setOriginalData(formattedUserData);
          setAvatarPreview(user.avatar_url || null);
        }
      } catch (error) {
        setToast({ type: 'error', message: error.message || 'Não foi possível carregar seu perfil.' });
        if (onNavigate) onNavigate('login');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [onNavigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'phone' ? formatPhone(value) : value;
    setUserData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setToast({ type: 'error', message: 'Por favor, selecione uma imagem válida.' });
      return;
    }
    
    // Validar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setToast({ type: 'error', message: 'A imagem deve ter no máximo 2MB.' });
      return;
    }
    
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploadingAvatar(true);
    
    setTimeout(() => {
      setUploadingAvatar(false);
      setToast({ type: 'success', message: 'Foto selecionada! Clique em "Salvar alterações" para confirmar.' });
    }, 500);
  };

  const validate = (data) => {
    const next = {};
    // Apenas valida campos que existem no objeto
    if (data.name !== undefined && (!data.name || data.name.trim().length < 2)) {
      next.name = 'Informe seu nome completo.';
    }
    if (data.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = 'Email inválido.';
    }
    if (data.phone !== undefined && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(data.phone)) {
      next.phone = 'Use o formato (99) 99999-9999.';
    }
    return next;
  };

  const handleSaveProfile = async () => {
    // Preparar dados que serão atualizados
    const updatedFields = {};
    
    if (userData.name !== originalData.name) {
      updatedFields.name = userData.name;
    }
    if (userData.email !== originalData.email) {
      updatedFields.email = userData.email;
    }
    if (userData.phone !== originalData.phone) {
      updatedFields.phone = userData.phone;
    }
    if (avatarFile) {
      updatedFields.avatar = avatarFile;
    }

    // Se não há nada para atualizar, apenas fecha o modo de edição
    if (Object.keys(updatedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    // Apenas valida campos que serão enviados
    const fieldsToValidate = {};
    if (updatedFields.name) fieldsToValidate.name = updatedFields.name;
    if (updatedFields.email) fieldsToValidate.email = updatedFields.email;
    if (updatedFields.phone) fieldsToValidate.phone = updatedFields.phone;

    const nextErrors = validate(fieldsToValidate);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    setToast(null);
    
    try {
      console.log('Enviando dados:', updatedFields);
      console.log('Avatar file presente?', !!updatedFields.avatar);
      console.log('Avatar file type:', updatedFields.avatar?.type);
      console.log('Avatar file size:', updatedFields.avatar?.size);
      
      const response = await updateProfile(updatedFields);
      console.log('Resposta do servidor:', response);
      
      if (response?.success && response.data?.user) {
        const user = response.data.user;
        const newUserData = {
          ...userData,
          name: user.name || userData.name,
          email: user.email || userData.email,
          phone: formatPhone(user.phone || userData.phone),
          plan: user.plan || userData.plan,
          planExpiresAt: user.plan_expires_at || userData.planExpiresAt,
          avatarUrl: user.avatar_url || userData.avatarUrl,
        };
        console.log('Avatar URL retornada:', user.avatar_url);
        setUserData(newUserData);
        setOriginalData(newUserData);
        if (user.avatar_url) {
          setAvatarPreview(user.avatar_url);
        }
        setAvatarFile(null);
        setToast({ type: 'success', message: response.message || 'Perfil atualizado com sucesso.' });
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setToast({ type: 'error', message: error.message || 'Erro ao salvar perfil.' });
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setUserData(originalData);
    setAvatarFile(null);
    setAvatarPreview(originalData.avatarUrl);
    setErrors({});
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmText('');
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText.toLowerCase() === 'excluir') {
      console.log('Conta excluída');
      alert('Sua conta foi excluída com sucesso. Sentiremos sua falta!');
      handleCloseDeleteModal();
      // Aqui você redirecionaria para logout/home
    } else {
      alert('Por favor, digite "excluir" para confirmar a exclusão da conta.');
    }
  };

  if (loading) {
    return (
      <div className="profile" style={{ backgroundColor: colors.background.default }}>
        <div className="profile-container">
          <div className="profile-loading">Carregando seus dados...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile" style={{ backgroundColor: colors.background.default }}>
      <div className="profile-container">
        {toast && (
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} aria-label="Fechar aviso">✕</button>
          </div>
        )}

        {/* Header */}
        <section className="profile-header">
          <div className="avatar-section">
            <div 
              className="avatar"
              style={{ backgroundColor: colors.primary.light }}
            >
              {uploadingAvatar && (
                <div className="avatar-loading">
                  <div className="spinner"></div>
                </div>
              )}
              {avatarPreview && !uploadingAvatar ? (
                <img src={avatarPreview} alt="Avatar" />
              ) : !uploadingAvatar && (
                <span style={{ color: colors.primary.main }}>
                  {userData.name.split(' ').map((n) => n[0]).join('')}
                </span>
              )}
            </div>
            <div className="header-info">
              <h1 style={{ color: colors.text.primary }}>
                {userData.name}
              </h1>
              <p style={{ color: colors.text.secondary }}>
                Membro desde {userData.memberSince}
              </p>
              {isEditing && (
                <label className="avatar-upload">
                  <span style={{ color: colors.primary.main }}>
                    📷 Trocar foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                  />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* Dados Pessoais */}
        <section className="profile-section">
          <div 
            className="section-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="section-header">
              <h2 style={{ color: colors.text.primary }}>
                <span className="section-icon">👤</span>
                Dados pessoais
              </h2>
              {!isEditing && (
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    color: colors.primary.main,
                    borderColor: colors.primary.main,
                  }}
                >
                  <span>✏️</span>
                  <span>Editar</span>
                </button>
              )}
            </div>

            <div className="section-content">
              <div className="info-grid">
                <div className="info-item">
                  <label style={{ color: colors.text.secondary }}>
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      maxLength={120}
                      className={`input ${errors.name ? 'invalid' : ''}`}
                      style={{
                        borderColor: colors.divider,
                        color: colors.text.primary,
                        backgroundColor: colors.background.default,
                      }}
                    />
                  ) : (
                    <p style={{ color: colors.text.primary }}>{userData.name}</p>
                  )}
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="info-item">
                  <label style={{ color: colors.text.secondary }}>
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      maxLength={120}
                      className={`input ${errors.email ? 'invalid' : ''}`}
                      style={{
                        borderColor: colors.divider,
                        color: colors.text.primary,
                        backgroundColor: colors.background.default,
                      }}
                    />
                  ) : (
                    <p style={{ color: colors.text.primary }}>{userData.email}</p>
                  )}
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="info-item">
                  <label style={{ color: colors.text.secondary }}>
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      maxLength={16}
                      className={`input ${errors.phone ? 'invalid' : ''}`}
                      style={{
                        borderColor: colors.divider,
                        color: colors.text.primary,
                        backgroundColor: colors.background.default,
                      }}
                    />
                  ) : (
                    <p style={{ color: colors.text.primary }}>{userData.phone}</p>
                  )}
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>

                <div className="info-item">
                  <label style={{ color: colors.text.secondary }}>
                    CPF
                  </label>
                  <p style={{ color: colors.text.primary }}>{userData.cpf}</p>
                </div>

                {/* <div className="info-item">
                  <label style={{ color: colors.text.secondary }}>
                    Data de Nascimento
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="birthDate"
                      value={userData.birthDate}
                      onChange={handleInputChange}
                      placeholder="DD/MM/AAAA"
                      maxLength={10}
                      className={`input ${errors.birthDate ? 'invalid' : ''}`}
                      style={{
                        borderColor: colors.divider,
                        color: colors.text.primary,
                        backgroundColor: colors.background.default,
                      }}
                    />
                  ) : (
                    <p style={{ color: colors.text.primary }}>{userData.birthDate}</p>
                  )}
                  {errors.birthDate && <span className="field-error">{errors.birthDate}</span>}
                </div> */}

                {/* <div className="info-item full-width">
                  <label style={{ color: colors.text.secondary }}>
                    Endereço
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      maxLength={200}
                      className={`input ${errors.address ? 'invalid' : ''}`}
                      style={{
                        borderColor: colors.divider,
                        color: colors.text.primary,
                        backgroundColor: colors.background.default,
                      }}
                    />
                  ) : (
                    <p style={{ color: colors.text.primary }}>{userData.address}</p>
                  )}
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div> */}
              </div>

              {isEditing && (
                <div className="edit-actions">
                  <button
                    className="save-button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.text.white,
                    }}
                  >
                    {saving ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                  <button
                    className="cancel-button"
                    onClick={handleCancelEdit}
                    style={{
                      color: colors.text.secondary,
                      borderColor: colors.divider,
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Plano Atual */}
        <section className="profile-section">
          <div 
            className="section-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="section-header">
              <h2 style={{ color: colors.text.primary }}>
                <span className="section-icon">💎</span>
                Plano Atual
              </h2>
            </div>

            <div className="section-content">
              {userData.plan ? (
                <div className="plan-info">
                  <div className="plan-header">
                    <div className="plan-badge" style={{ backgroundColor: colors.primary.main }}>
                      <span style={{ color: colors.text.white }}>{userData.plan.name}</span>
                    </div>
                    <div className="plan-price">
                      <span 
                        className="price-value"
                        style={{ color: colors.text.primary }}
                      >
                        {formatPrice(userData.plan.price, userData.plan.currency)}
                      </span>
                      <span 
                        className="price-period"
                        style={{ color: colors.text.secondary }}
                      >
                        {formatPeriod(userData.plan.duration_days)}
                      </span>
                    </div>
                  </div>

                  <div 
                    className="billing-info"
                    style={{ 
                      backgroundColor: colors.background.default,
                      borderColor: colors.divider,
                    }}
                  >
                    <span style={{ color: colors.text.secondary }}>
                      Expira em:
                    </span>
                    <span style={{ color: colors.text.primary, fontWeight: 600 }}>
                      {formatDate(userData.planExpiresAt)}
                    </span>
                  </div>

                  <div className="plan-features">
                    <h3 style={{ color: colors.text.primary }}>
                      Benefícios inclusos:
                    </h3>
                    <ul>
                      {(userData.plan.features || []).map((feature, index) => (
                        <li key={index} style={{ color: colors.text.primary }}>
                          <span className="feature-check">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className="change-plan-button"
                    onClick={() => onNavigate && onNavigate('plans')}
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.text.white,
                    }}
                  >
                    Alterar Plano
                  </button>
                </div>
              ) : (
                <div className="plan-info">
                  <p style={{ color: colors.text.secondary }}>Nenhum plano ativo no momento.</p>
                  <button
                    className="change-plan-button"
                    onClick={() => onNavigate && onNavigate('plans')}
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.text.white,
                    }}
                  >
                    Escolher um plano
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ações da Conta */}
        <section className="profile-section">
          <div 
            className="section-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="section-header">
              <h2 style={{ color: colors.text.primary }}>
                <span className="section-icon">⚙️</span>
                Configurações da Conta
              </h2>
            </div>

            <div className="section-content">
              <div className="account-actions">
                <button
                  className="action-button contact"
                  onClick={() => onNavigate && onNavigate('contact')}
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  <span>📧</span>
                  <div>
                    <strong>Editar Contato</strong>
                    <small>Atualize suas informações de contato</small>
                  </div>
                </button>

                <button
                  className="action-button delete"
                  onClick={handleDeleteAccount}
                  style={{
                    color: colors.text.secondary,
                    borderColor: colors.divider,
                  }}
                >
                  <span>🗑️</span>
                  <div>
                    <strong>Excluir Conta</strong>
                    <small>Remover permanentemente sua conta</small>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <>
          <div 
            className="modal-overlay"
            onClick={handleCloseDeleteModal}
            style={{ backgroundColor: colors.overlay.medium }}
          />
          <div 
            className="delete-modal"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="modal-header">
              <div className="warning-icon">⚠️</div>
              <h3 style={{ color: colors.text.primary }}>
                Excluir Conta Permanentemente
              </h3>
            </div>

            <div className="modal-content">
              <p style={{ color: colors.text.primary }}>
                Esta ação é <strong>irreversível</strong> e resultará em:
              </p>
              <ul className="warning-list">
                <li style={{ color: colors.text.primary }}>
                  ❌ Exclusão permanente de todos os seus dados
                </li>
                <li style={{ color: colors.text.primary }}>
                  ❌ Perda de acesso a todos os projetos
                </li>
                <li style={{ color: colors.text.primary }}>
                  ❌ Cancelamento imediato da assinatura
                </li>
                <li style={{ color: colors.text.primary }}>
                  ❌ Não será possível recuperar sua conta
                </li>
              </ul>

              <div className="confirmation-input">
                <label style={{ color: colors.text.primary }}>
                  Para confirmar, digite <strong>"excluir"</strong> abaixo:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Digite: excluir"
                  style={{
                    borderColor: colors.divider,
                    color: colors.text.primary,
                    backgroundColor: colors.background.default,
                  }}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={handleCloseDeleteModal}
                style={{
                  backgroundColor: colors.background.default,
                  color: colors.text.primary,
                  borderColor: colors.divider,
                }}
              >
                Cancelar
              </button>
              <button
                className="modal-button confirm"
                onClick={handleConfirmDelete}
                disabled={deleteConfirmText.toLowerCase() !== 'excluir'}
                style={{
                  backgroundColor: deleteConfirmText.toLowerCase() === 'excluir' 
                    ? colors.error.main 
                    : colors.divider,
                  color: colors.text.white,
                  opacity: deleteConfirmText.toLowerCase() === 'excluir' ? 1 : 0.5,
                  cursor: deleteConfirmText.toLowerCase() === 'excluir' 
                    ? 'pointer' 
                    : 'not-allowed',
                }}
              >
                Excluir Permanentemente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
