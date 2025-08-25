"use client"

import type * as React from "react"
import { Home, Package, BarChart3, Bell, Settings, User, Scale, FileText, ChevronRight, Rocket, Zap, LogIn } from "lucide-react"
import { useState, useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import axios from "@/axiosConfig"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onNavigate?: (section: string) => void
  onNavigateWizardStep?: (step: number) => void
  currentSection?: string
}

const data = {
  user: {
    name: "홍길동",
    email: "hong@foodlaw.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "대시보드",
      url: "#",
      icon: Home,
      section: "dashboard",
    },
    {
      title: "제품 개발",
      url: "#",
      icon: Zap,
      section: "product-development",
      items: [
        {
          title: "새 제품 등록",
          url: "#",
          section: "new-product",
        },
        {
          title: "1단계 - 제품 정보",
          url: "#",
          section: "product-wizard-step1",
        },
        {
          title: "2단계 - 재료 입력",
          url: "#",
          section: "product-wizard-step2",
        },
        {
          title: "3단계 - 영양성분 입력",
          url: "#",
          section: "product-wizard-step3",
        },
        {
          title: "4단계 - 표시사항 입력",
          url: "#",
          section: "product-wizard-step4",
        },
      ],
    },
    {
      title: "제품 관리",
      url: "#",
      icon: Package,
      section: "standards",
      items: [
        {
          title: "제품 목록",
          url: "#",
          section: "product-list",
        },
        {
          title: "제품품질관리규격서",
          url: "#",
          section: "standards",
        },
      ],
    },
    {
      title: "법령 정보",
      url: "#",
      icon: Scale,
      section: "lawDetails",
      items: [
        {
          title: "법령 검색",
          url: "#",
          section: "lawDetails",
        },
        {
          title: "식품위생법",
          url: "#",
          section: "lawDetails",
        },
        {
          title: "식품공전",
          url: "#",
          section: "lawDetails",
        },
        {
          title: "표시기준",
          url: "#",
          section: "lawDetails",
        },
      ],
    },
    {
      title: "분석 결과",
      url: "#",
      icon: BarChart3,
      section: "result",
    },
    {
      title: "보고서",
      url: "#",
      icon: FileText,
      section: "reports",
    },
  ],
  navSecondary: [
    {
      title: "법령 업데이트",
      url: "#",
      icon: Bell,
      badge: "3",
      section: "lawUpdates",
    },
    {
      title: "설정",
      url: "#",
      icon: Settings,
      section: "settings",
    },
    {
      title: "🚀 제품 등록 마법사",
      url: "#",
      icon: Rocket,
      section: "product-wizard",
      badge: "NEW",
    },
  ],
}

export function AppSidebar({ onNavigate, onNavigateWizardStep, currentSection, ...props }: AppSidebarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    avatar: "/placeholder.svg",
    profile_picture: "/placeholder.svg"
  })

  useEffect(() => {
    // 로그인 상태 확인 로직
    const checkLoginStatus = async () => {
      try {
        setIsLoading(true)
        // 로컬 스토리지에서 로그인 상태 확인
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')
        
        if (token && userData) {
          setIsLoggedIn(true)
          setCurrentUser(JSON.parse(userData))
        } else {
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('로그인 상태 확인 실패:', error)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkLoginStatus()
  }, [])

  const handleLogin = () => {
    // 로그인 페이지로 이동
    window.location.href = '/login'
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      // 로컬 스토리지에서 인증 정보 제거
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      
      setIsLoggedIn(false)
      setCurrentUser({
        name: "",
        email: "",
        avatar: "/placeholder.svg",
        profile_picture: "/placeholder.svg"
      })
      
      // 홈페이지로 리다이렉트
      window.location.href = '/'
    } catch (error) {
      console.error('로그아웃 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Scale className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">FoodLaw</span>
                  <span className="truncate text-xs">식품 법규 관리</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메인 메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items?.length ? (
                    <Collapsible defaultOpen={currentSection === item.section} className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={currentSection === item.section}
                          onClick={() => onNavigate?.(item.section)}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                onClick={() => {
                                  // 새 제품 등록인 경우 모달 열기
                                  if (subItem.section === 'new-product') {
                                    // 새 제품 등록 모달을 열기 위한 특별한 액션
                                    onNavigate?.('new-product-modal')
                                  }
                                  // 마법사 단계인 경우 onNavigateWizardStep 사용
                                  else if (subItem.section.startsWith('product-wizard-step')) {
                                    const step = parseInt(subItem.section.replace('product-wizard-step', ''))
                                    onNavigateWizardStep?.(step)
                                  } else {
                                    onNavigate?.(subItem.section)
                                  }
                                }}
                                isActive={currentSection === subItem.section}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={currentSection === item.section}
                      onClick={() => onNavigate?.(item.section)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>기타</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} onClick={() => onNavigate?.(item.section)}>
                    <item.icon />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoading ? (
              <SidebarMenuButton size="lg" disabled>
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">로딩 중...</span>
                </div>
              </SidebarMenuButton>
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={currentUser.profile_picture || currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                      <AvatarFallback className="rounded-lg">{currentUser.name?.charAt(0) || "사"}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{currentUser.name}</span>
                      <span className="truncate text-xs">{currentUser.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    프로필
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton
                size="lg"
                onClick={handleLogin}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <LogIn className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">로그인하기</span>
                  <span className="truncate text-xs">계정에 로그인하세요</span>
                </div>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
