const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')

// Helper to get stored auth token
export const getToken = () => localStorage.getItem('gilbert_admin_token') || localStorage.getItem('krinova_admin_token')

// Helper to set auth token
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('gilbert_admin_token', token)
  } else {
    localStorage.removeItem('gilbert_admin_token')
    localStorage.removeItem('krinova_admin_token')
  }
}

// Universal fetch request handler with Authorization Bearer header
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    ...options.headers,
  }

  // Set Authorization Header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Don't set Content-Type if uploading FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized / Token expired
        setToken(null)
      }
      throw new Error(data.message || `Request failed with status ${response.status}`)
    }

    return data
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message)
    throw error
  }
}

// API Service Functions
export const authAPI = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (profileData) =>
    apiRequest('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
  updatePassword: (passwordData) =>
    apiRequest('/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    }),
}

export const blogAPI = {
  getBlogs: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/blogs${query ? `?${query}` : ''}`)
  },
  getBlogBySlug: (slugOrId) => apiRequest(`/blogs/${slugOrId}`),
  createBlog: (blogData) =>
    apiRequest('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    }),
  updateBlog: (id, blogData) =>
    apiRequest(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    }),
  deleteBlog: (id) =>
    apiRequest(`/blogs/${id}`, {
      method: 'DELETE',
    }),
  uploadImage: (formData) =>
    apiRequest('/blogs/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const inquiryAPI = {
  getInquiries: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/inquiries${query ? `?${query}` : ''}`)
  },
  createInquiry: (inquiryData) =>
    apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    }),
  updateStatus: (id, status) =>
    apiRequest(`/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  deleteInquiry: (id) =>
    apiRequest(`/inquiries/${id}`, {
      method: 'DELETE',
    }),
}

export const dashboardAPI = {
  getStats: () => apiRequest('/dashboard/stats'),
}

export const bannerAPI = {
  getBanner: () => apiRequest('/banner'),
  updateBanner: (bannerData) =>
    apiRequest('/banner', {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    }),
  uploadImage: (formData) =>
    apiRequest('/banner/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const introAPI = {
  getIntro: () => apiRequest('/intro'),
  updateIntro: (introData) =>
    apiRequest('/intro', {
      method: 'PUT',
      body: JSON.stringify(introData),
    }),
  uploadImage: (formData) =>
    apiRequest('/intro/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const aboutAPI = {
  getAbout: () => apiRequest('/about'),
  updateAbout: (aboutData) =>
    apiRequest('/about', {
      method: 'PUT',
      body: JSON.stringify(aboutData),
    }),
  uploadImage: (formData) =>
    apiRequest('/about/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const impactAPI = {
  getImpact: () => apiRequest('/impact'),
  updateImpact: (impactData) =>
    apiRequest('/impact', {
      method: 'PUT',
      body: JSON.stringify(impactData),
    }),
  uploadImage: (formData) =>
    apiRequest('/impact/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const projectAPI = {
  getProjects: () => apiRequest('/projects'),
  updateProjects: (projectData) =>
    apiRequest('/projects', {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }),
  uploadImage: (formData) =>
    apiRequest('/projects/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const featuredStoryAPI = {
  getFeaturedStory: () => apiRequest('/featured-story'),
  updateFeaturedStory: (storyData) =>
    apiRequest('/featured-story', {
      method: 'PUT',
      body: JSON.stringify(storyData),
    }),
  uploadImage: (formData) =>
    apiRequest('/featured-story/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const galleryAPI = {
  getGallery: () => apiRequest('/gallery'),
  updateGallery: (galleryData) =>
    apiRequest('/gallery', {
      method: 'PUT',
      body: JSON.stringify(galleryData),
    }),
  uploadImage: (formData) =>
    apiRequest('/gallery/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const educationAPI = {
  getEducation: () => apiRequest('/education'),
  updateEducation: (educationData) =>
    apiRequest('/education', {
      method: 'PUT',
      body: JSON.stringify(educationData),
    }),
  uploadImage: (formData) =>
    apiRequest('/education/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const insightsSectionAPI = {
  getInsightsSection: () => apiRequest('/insights-section'),
  updateInsightsSection: (data) =>
    apiRequest('/insights-section', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

export const philosophyAPI = {
  getPhilosophy: () => apiRequest('/philosophy'),
  updatePhilosophy: (data) =>
    apiRequest('/philosophy', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  uploadImage: (formData) =>
    apiRequest('/philosophy/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const settingsAPI = {
  getSettings: () => apiRequest('/settings'),
  updateSettings: (data) =>
    apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  uploadLogo: (formData) =>
    apiRequest('/settings/upload-logo', {
      method: 'POST',
      body: formData,
    }),
  changePassword: (passwordData) =>
    apiRequest('/settings/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    }),
}

export const journeyAPI = {
  getJourney: () => apiRequest('/journey'),
  updateJourney: (data) =>
    apiRequest('/journey', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  uploadImage: (formData) =>
    apiRequest('/journey/upload', {
      method: 'POST',
      body: formData,
    }),
}

export const livingTestimonyAPI = {
  getTestimonies: () => apiRequest('/testimonies'),
  updateTestimonies: (data) =>
    apiRequest('/testimonies', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  uploadImage: (formData) =>
    apiRequest('/testimonies/upload', {
      method: 'POST',
      body: formData,
    }),
}









