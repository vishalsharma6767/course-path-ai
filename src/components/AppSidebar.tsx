import { NavLink, useLocation } from "react-router-dom"
import { 
  Brain, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Building, 
  Award, 
  Calendar,
  MessageSquare,
  BarChart3,
  GraduationCap,
  LogOut,
  Home
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "AI Quiz", url: "/quiz", icon: Brain },
  { title: "Colleges", url: "/colleges", icon: Building },
  { title: "Scholarships", url: "/scholarships", icon: Award },
]

const toolsItems = [
  { title: "Career Roadmaps", url: "/career-roadmaps", icon: BookOpen },
  { title: "Smart Timetable", url: "/smart-timetable", icon: Calendar },
  { title: "AI Mentor Chat", url: "/ai-mentor", icon: MessageSquare },
  { title: "Progress Tracker", url: "/progress-tracker", icon: BarChart3 },
]

const supportItems = [
  { title: "Passion Studies", url: "/passion-studies", icon: Users },
  { title: "Stress Check", url: "/stress-check", icon: Brain },
  { title: "Parent Zone", url: "/parent-zone", icon: Users },
  { title: "Mentorship", url: "/mentorship", icon: Users },
  { title: "Smart Dashboard", url: "/smart-dashboard", icon: TrendingUp },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const { toast } = useToast()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground" : ""

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Logged out successfully",
      description: "Come back soon to continue your learning!",
    })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          {!collapsed && (
            <h2 className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
              Catalyst
            </h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}