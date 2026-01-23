import { buildUrl } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || 'Erro ao processar a requisição.';
    const errors = data?.errors || null;
    const error = new Error(message);
    error.status = response.status;
    error.errors = errors;
    throw error;
  }
  return data;
};

const register = async ({ name, email, phone, password, password_confirmation, plan_id }) => {
  const response = await fetch(buildUrl('/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ name, email, phone, password, password_confirmation, plan_id }),
  });

  const data = await handleResponse(response);
  if (data.success && data.data?.token) {
    localStorage.setItem('auth_token', data.data.token);
    if (data.data.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
  }
  return data;
};

const login = async ({ email, password }) => {
  const response = await fetch(buildUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);
  if (data.success && data.data?.token) {
    localStorage.setItem('auth_token', data.data.token);
    if (data.data.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
  }
  return data;
};

const forgotPassword = async ({ email }) => {
  const response = await fetch(buildUrl('/auth/forgot-password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse(response);
};

const logout = async () => {
  const response = await fetch(buildUrl('/auth/logout'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  });

  const data = await handleResponse(response);
  localStorage.removeItem('auth_token');
  return data;
};

const getCurrentUser = async () => {
  const response = await fetch(buildUrl('/auth/me'), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  });

  const data = await handleResponse(response);
  return data;
};

const updateProfile = async ({ name, email, phone, avatar }) => {
  const formData = new FormData();
  
  // IMPORTANTE: Laravel method spoofing - PHP não processa multipart/form-data em PATCH
  // Então enviamos como POST mas com _method=PATCH
  formData.append('_method', 'PATCH');
  
  console.log('updateProfile recebeu:', { name, email, phone, avatar: !!avatar, avatarType: avatar?.type });
  
  // Apenas adiciona campos que foram fornecidos
  if (name !== undefined) {
    console.log('Adicionando name:', name);
    formData.append('name', name);
  }
  if (email !== undefined) {
    console.log('Adicionando email:', email);
    formData.append('email', email);
  }
  if (phone !== undefined) {
    console.log('Adicionando phone:', phone);
    formData.append('phone', phone);
  }
  if (avatar) {
    console.log('Adicionando avatar ao FormData:', avatar.name, avatar.size, avatar.type);
    formData.append('avatar', avatar);
  }

  console.log('FormData final - entries:');
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}: File(${value.name}, ${value.size}b, ${value.type})`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  }

  // Enviar como POST para que o PHP processe o multipart/form-data
  // O Laravel vai converter para PATCH por causa do _method
  const response = await fetch(buildUrl('/auth/me'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
    body: formData,
  });

  const data = await handleResponse(response);
  if (data.success && data.data?.user) {
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data;
};

export { register, login, forgotPassword, logout, getCurrentUser, updateProfile };
