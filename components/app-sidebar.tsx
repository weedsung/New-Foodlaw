"use client"

import type * as React from "react"
import { Home, Package, BarChart3, Bell, Settings, User, Scale, FileText, ChevronRight, LogIn } from "lucide-react"
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
      title: "제품 관리",
      url: "#",
      icon: Package,
      section: "standards",
      items: [
        {
          title: "새 제품 등록",
          url: "#",
          section: "new-product",
        },
        {
          title: "제품 목록",
          url: "#",
          section: "product-list",
        },
        {
          title: "배합비 관리",
          url: "#",
          section: "standards",
        },
        {
          title: "규격 관리",
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
  ],
}

export function AppSidebar({ onNavigate, currentSection, ...props }: AppSidebarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/user/check')
      
      if (response.status === 200) {
        const data = response.data
        setIsLoggedIn(data.isAuthenticated)
        setUser(data.user)
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false)
        setUser(null)
      } else {
        console.error('인증 상태 확인 실패:', error)
        setIsLoggedIn(false)
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = () => {
    window.location.href = '/login'
  }

  const handleLogout = async () => {
    window.location.href = 'http://localhost:8080/api/user/logout'
  }

  const defaultUser = {
    name: "홍길동",
    email: "hong@foodlaw.com",
    avatar: "/placeholder.svg?height=32&width=32",
  }

  const currentUser = user || defaultUser

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
                                asChild
                                onClick={() => onNavigate?.(subItem.section)}
                                isActive={currentSection === subItem.section}
                              >
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={currentSection === item.section}
                      onClick={() => onNavigate?.(item.section)}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
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
                  <SidebarMenuButton asChild tooltip={item.title} onClick={() => onNavigate?.(item.section)}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
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
