// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:7860';

// API Endpoints
export const ENDPOINTS = {
  // Report endpoints
  REPORT_CREATE: `${API_URL}/api/reports`,
  REPORT_TRACK: (trackingId) => `${API_URL}/api/reports/track/${trackingId}`,
  REPORT_NEARBY_VOLUNTEERS: (trackingId) => `${API_URL}/api/reports/${trackingId}/nearby-volunteers`,
  
  // NGO endpoints
  NGO_REGISTER: `${API_URL}/api/ngo/register`,
  NGO_LOGIN: `${API_URL}/api/ngo/login`,
  
  // Volunteer endpoints
  VOLUNTEER_REGISTER: `${API_URL}/api/volunteer/register`,
  VOLUNTEER_LOGIN: `${API_URL}/api/volunteer/login`,
  VOLUNTEER_ESCALATED_CASES: `${API_URL}/api/volunteer/escalated-cases`,
  VOLUNTEER_ACCEPT_CASE: (reportId) => `${API_URL}/api/volunteer/accept-case/${reportId}`,
  VOLUNTEER_MARK_RESCUED: (reportId) => `${API_URL}/api/volunteer/mark-rescued/${reportId}`,
  
  // Adoption endpoints
  ADOPTION_GET: `${API_URL}/api/adoptions`,
  ADOPTION_CREATE: `${API_URL}/api/adoptions`,
  
  // Admin endpoints
  ADMIN_PENDING_NGOS: `${API_URL}/api/admin/pending-ngos`,
  ADMIN_APPROVED_NGOS: `${API_URL}/api/admin/approved-ngos`,
  ADMIN_APPROVE_NGO: (ngoId) => `${API_URL}/api/admin/ngo/${ngoId}/approve`,
  ADMIN_PENDING_VOLUNTEERS: `${API_URL}/api/admin/pending-volunteers`,
  ADMIN_APPROVED_VOLUNTEERS: `${API_URL}/api/admin/approved-volunteers`,
  ADMIN_APPROVE_VOLUNTEER: (volunteerId) => `${API_URL}/api/admin/approve-volunteer/${volunteerId}`,
  
  // Socket.io server
  SOCKET_SERVER: API_URL,
  
  // AI/Flask API endpoints
  AI_PREDICT: `${AI_API_URL}/predict`,
};
