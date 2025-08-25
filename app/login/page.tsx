"use client"

import { useState } from 'react'
import { Scale, LogIn } from 'lucide-react'
import axios from '@/axiosConfig'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = () => {
    // Google OAuth 로그인 처리
    // 실제로는 Google OAuth API를 사용해야 합니다
    
    // 임시로 로그인 성공 처리 (실제 구현 시 제거)
    const userData = {
      name: "Google 사용자",
      email: "google@example.com",
      avatar: "/placeholder.svg",
      profile_picture: "/placeholder.svg"
    }
    
    localStorage.setItem('authToken', 'google-token-' + Date.now())
    localStorage.setItem('userData', JSON.stringify(userData))
    
    // 홈페이지로 리다이렉트
    window.location.href = '/'
    
    // 실제 Google OAuth 구현 시 아래 주석 해제
    // window.location.href = 'http://localhost:8080/api/user/login/google'
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // 이메일/비밀번호 로그인 로직 (백엔드에서 구현 필요)
      console.log('이메일 로그인:', { email, password, rememberMe })
      
      // 임시로 로그인 성공 처리 (실제로는 백엔드 API 호출 후 처리)
      if (email && password) {
        // 로컬 스토리지에 사용자 정보 저장
        const userData = {
          name: email.split('@')[0], // 임시로 이메일에서 이름 추출
          email: email,
          avatar: "/placeholder.svg",
          profile_picture: "/placeholder.svg"
        }
        
        localStorage.setItem('authToken', 'temp-token-' + Date.now())
        localStorage.setItem('userData', JSON.stringify(userData))
        
        // 홈페이지로 리다이렉트
        window.location.href = '/'
      }
    } catch (error) {
      console.error('로그인 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* 로고 및 제목 */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Scale className="size-6" />
              </div>
            </div>
            <div className="text-4xl font-bold text-blue-600 drop-shadow-sm mb-2">FoodLaw</div>
            <p className="text-gray-600">Google 계정으로 간편하게 로그인하세요</p>
          </div>

          {/* 로그인 카드 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              {/* Google 로그인 버튼 */}
              <div>
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium">Google로 로그인</span>
                </button>
              </div>

              {/* 구분선 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              {/* 이메일/비밀번호 로그인 */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    이메일 주소
                  </label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      id="remember-me" 
                      name="remember-me" 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      로그인 상태 유지
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      비밀번호 찾기
                    </a>
                  </div>
                </div>
                <div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        로그인 중...
                      </div>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        로그인
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* 회원가입 링크 */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  계정이 없으신가요? 
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                    회원가입
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* 하단 정보 */}
          <div className="text-center text-sm text-gray-500">
            <p>
              로그인하면{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">이용약관</a>과{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
