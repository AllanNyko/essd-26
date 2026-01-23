import { buildUrl } from '../config/api';

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

export const planService = {
  async getPlans() {
    const response = await fetch(buildUrl('/plans'), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    return handleResponse(response);
  },

  async getPlan(planId) {
    const response = await fetch(buildUrl(`/plans/${planId}`), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    return handleResponse(response);
  },
};
