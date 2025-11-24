import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echoInstance = null;

export function initRealtime(token) {
  if (echoInstance) return echoInstance;
  window.Pusher = Pusher;
  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_KEY || 'local',
    wsHost: import.meta.env.VITE_PUSHER_HOST || 'localhost',
    wsPort: parseInt(import.meta.env.VITE_PUSHER_PORT || '6001'),
    wssPort: parseInt(import.meta.env.VITE_PUSHER_PORT || '6001'),
    forceTLS: false,
    cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'mt1',
    disableStats: true,
    authEndpoint: (import.meta.env.VITE_API_URL || 'http://localhost:8000/api') + '/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });
  return echoInstance;
}

export function subscribeUserChannels(echo, userId, handlers = {}) {
  const channel = echo.private(`App.Models.User.${userId}`);
  channel.listen('UploadCompleted', (e) => {
    handlers.onUploadCompleted && handlers.onUploadCompleted(e);
  });
  channel.listen('ShareCreated', (e) => {
    handlers.onShareCreated && handlers.onShareCreated(e);
  });
  channel.listen('FriendRequestSent', (e) => {
    handlers.onFriendRequest && handlers.onFriendRequest(e);
  });
}
