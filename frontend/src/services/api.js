import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Research Plans
export const getResearchPlans = () => api.get('/research-plans');
export const getResearchPlan = (id) => api.get(`/research-plans/${id}`);
export const createResearchPlan = (planData) => api.post('/research-plans', planData);
export const updateResearchPlan = (id, planData) => api.put(`/research-plans/${id}`, planData);
export const deleteResearchPlan = (id) => api.delete(`/research-plans/${id}`);

// Sections
export const getSections = () => api.get('/sections');
export const getSectionsByPlan = (planId) => api.get(`/sections/plan/${planId}`);
export const createSection = (sectionData) => api.post('/sections', sectionData);
export const updateSection = (id, sectionData) => api.put(`/sections/${id}`, sectionData);

// Objectives
export const getObjectivesByPlan = (planId) => api.get(`/objectives/plan/${planId}`);
export const createObjective = (objectiveData) => api.post('/objectives', objectiveData);

// Hypotheses
export const getHypothesesByPlan = (planId) => api.get(`/hypotheses/plan/${planId}`);
export const createHypothesis = (hypothesisData) => api.post('/hypotheses', hypothesisData);

// Variables
export const getVariablesByPlan = (planId) => api.get(`/variables/plan/${planId}`);
export const createVariable = (variableData) => api.post('/variables', variableData);

// Bibliography
export const getBibliographyByPlan = (planId) => api.get(`/bibliography/plan/${planId}`);
export const createBibliography = (bibliographyData) => api.post('/bibliography', bibliographyData);

// Activities
export const getActivitiesByPlan = (planId) => api.get(`/activities/plan/${planId}`);
export const createActivity = (activityData) => api.post('/activities', activityData);

// Reviews
export const getReviewsByPlan = (planId) => api.get(`/reviews/plan/${planId}`);
export const createReview = (reviewData) => api.post('/reviews', reviewData);

// Plan History
export const getPlanHistory = (planId) => api.get(`/plan-history/plan/${planId}`);
export const createPlanHistory = (historyData) => api.post('/plan-history', historyData);

export default api;