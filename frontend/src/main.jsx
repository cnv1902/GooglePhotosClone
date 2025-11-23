import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>Lỗi khởi động ứng dụng</h2>
      <p>${error.message}</p>
      <p>Vui lòng kiểm tra console để biết thêm chi tiết.</p>
    </div>
  `;
}
