
import axios from 'axios';

// 백엔드 API 기본 URL 설정
const axiosInstance = axios.create({
  baseURL: 'https://foodlaw-production-e1f3.up.railway.app/api',
  timeout: 30000, // 30초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (요청 전 처리)
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('🚀 API 요청 시작:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('❌ API 요청 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (응답 후 처리)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ API 응답 성공:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('❌ API 응답 오류:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    
    // 네트워크 오류인 경우
    if (error.code === 'ECONNREFUSED') {
      console.error('🔴 백엔드 서버에 연결할 수 없습니다. Railway 서버가 실행 중인지 확인하세요.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

