const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Kiểm tra nếu response không phải JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || 'Có lỗi xảy ra');
      }

      if (!response.ok) {
        // Xử lý lỗi 401 (Unauthorized) - token hết hạn hoặc không hợp lệ
        if (response.status === 401) {
          this.setToken(null);
          // Chỉ redirect nếu không phải đang ở trang đăng nhập
          if (!window.location.pathname.includes('/sign-in') && !window.location.pathname.includes('/sign-up')) {
            window.location.href = '/sign-in';
          }
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        throw new Error(data.message || data.error || 'Có lỗi xảy ra');
      }

      return data;
    } catch (error) {
      // Nếu là lỗi network, thêm thông tin
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
      }
      throw error;
    }
  }

  // Auth
  async register(userData) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    const data = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async forgotPassword(email) {
    return this.request('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(profileData) {
    const formData = new FormData();
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.avatar) formData.append('avatar', profileData.avatar);
    if (profileData.date_of_birth !== undefined && profileData.date_of_birth !== null) {
      formData.append('date_of_birth', profileData.date_of_birth);
    }
    if (profileData.gender !== undefined && profileData.gender !== null) {
      formData.append('gender', profileData.gender);
    }
    if (profileData.bio !== undefined && profileData.bio !== null) {
      formData.append('bio', profileData.bio);
    }

    const token = this.token;
    const url = `${this.baseURL}/profile`;
    
    const headers = {
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || 'Có lỗi xảy ra');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Có lỗi xảy ra');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
      }
      throw error;
    }
  }

  // Friends
  async getFriends(status = 'accepted') {
    return this.request(`/friends?status=${status}`);
  }

  async getSuggestedUsers(limit = 10) {
    return this.request(`/friends/suggested?limit=${limit}`);
  }

  async getPendingRequests() {
    return this.request('/friends/pending-requests');
  }

  async sendFriendRequest(friendId) {
    return this.request('/friends/send-request', {
      method: 'POST',
      body: JSON.stringify({ friend_id: friendId }),
    });
  }

  async acceptFriendRequest(friendshipId) {
    return this.request('/friends/accept-request', {
      method: 'POST',
      body: JSON.stringify({ friendship_id: friendshipId }),
    });
  }

  async removeFriend(friendshipId) {
    return this.request('/friends/remove', {
      method: 'POST',
      body: JSON.stringify({ friendship_id: friendshipId }),
    });
  }

  async blockFriend(friendId) {
    return this.request('/friends/block', {
      method: 'POST',
      body: JSON.stringify({ friend_id: friendId }),
    });
  }

  async searchUsers(query) {
    return this.request(`/friends/search?q=${encodeURIComponent(query)}`);
  }

  // Media
  async uploadMedia(files) {
    const formData = new FormData();
    // Đảm bảo files là array
    const fileArray = Array.isArray(files) ? files : [files];
    
    // Kiểm tra có file không
    if (fileArray.length === 0) {
      throw new Error('Không có file nào được chọn');
    }
    
    // Laravel nhận files[] - append với key files[]
    fileArray.forEach((file, index) => {
      if (file instanceof File) {
        formData.append(`files[${index}]`, file);
      } else {
        console.error('Invalid file:', file);
      }
    });

    // Không set Content-Type header, để browser tự set với boundary cho multipart/form-data
    const token = this.token;
    const url = `${this.baseURL}/media/upload`;
    
    const headers = {
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || 'Có lỗi xảy ra');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Có lỗi xảy ra');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại.');
      }
      throw error;
    }
  }

  async getMedia(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/media?${queryString}`);
  }

  async getMediaGroupedByUploadDate() {
    return this.request('/media/group-by-upload-date');
  }

  async getMediaGroupedByTakenDate() {
    return this.request('/media/group-by-taken-date');
  }

  async getMediaGroupedByLocation() {
    return this.request('/media/group-by-location');
  }

  async getMediaById(id) {
    return this.request(`/media/${id}`);
  }

  async deleteMedia(ids) {
    return this.request('/media/delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  }

  async forceDeleteMedia(ids) {
    return this.request('/media/force-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  }

  async restoreMedia(ids) {
    return this.request('/media/restore', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  }

  async getTrash(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/media/trash/list?${queryString}`);
  }

  async toggleFavorite(id) {
    return this.request('/media/toggle-favorite', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  }

  // Media Tags
  async addTagsToMedia(mediaId, tags) {
    return this.request('/media/add-tags', {
      method: 'POST',
      body: JSON.stringify({ media_id: mediaId, tags }),
    });
  }

  async removeTagsFromMedia(mediaId, tagIds) {
    return this.request('/media/remove-tags', {
      method: 'POST',
      body: JSON.stringify({ media_id: mediaId, tag_ids: tagIds }),
    });
  }

  // Tags CRUD
  async getTags(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tags?${queryString}`);
  }

  async createTag(name, color) {
    return this.request('/tags', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
  }

  async updateTag(id, data) {
    return this.request(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id) {
    return this.request(`/tags/${id}`, {
      method: 'DELETE',
    });
  }

  // Albums
  async getAlbums(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/albums?${queryString}`);
  }

  async createAlbum(albumData) {
    return this.request('/albums', {
      method: 'POST',
      body: JSON.stringify(albumData),
    });
  }

  async createAutoAlbum(criteria, title) {
    return this.request('/albums/auto-create', {
      method: 'POST',
      body: JSON.stringify({ criteria, title }),
    });
  }

  async getAlbumById(id) {
    return this.request(`/albums/${id}`);
  }

  async updateAlbum(id, albumData) {
    return this.request(`/albums/${id}`, {
      method: 'PUT',
      body: JSON.stringify(albumData),
    });
  }

  async deleteAlbum(id) {
    return this.request(`/albums/${id}`, {
      method: 'DELETE',
    });
  }

  async addMediaToAlbum(albumId, mediaIds) {
    return this.request(`/albums/${albumId}/add-media`, {
      method: 'POST',
      body: JSON.stringify({ media_ids: mediaIds }),
    });
  }

  async removeMediaFromAlbum(albumId, mediaIds) {
    return this.request(`/albums/${albumId}/remove-media`, {
      method: 'POST',
      body: JSON.stringify({ media_ids: mediaIds }),
    });
  }

  // Shares
  async createPublicLink(shareableType, shareableId, options = {}) {
    return this.request('/shares/public-link', {
      method: 'POST',
      body: JSON.stringify({
        shareable_type: shareableType,
        shareable_id: shareableId,
        ...options,
      }),
    });
  }

  async shareWithFriends(shareableType, shareableId, friendIds, options = {}) {
    return this.request('/shares/with-friends', {
      method: 'POST',
      body: JSON.stringify({
        shareable_type: shareableType,
        shareable_id: shareableId,
        friend_ids: friendIds,
        ...options,
      }),
    });
  }

  async getMyShares(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/shares/my-shares?${queryString}`);
  }

  async getSharedWithMe(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/shares/shared-with-me?${queryString}`);
  }

  async updateShare(id, options) {
    return this.request(`/shares/${id}`, {
      method: 'PUT',
      body: JSON.stringify(options),
    });
  }

  async deleteShare(id) {
    return this.request(`/shares/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications?${queryString}`);
  }

  async markNotificationsAsRead(ids) {
    return this.request('/notifications/mark-as-read', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-as-read', {
      method: 'POST',
    });
  }

  async getUnreadNotificationCount() {
    return this.request('/notifications/unread-count');
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();

