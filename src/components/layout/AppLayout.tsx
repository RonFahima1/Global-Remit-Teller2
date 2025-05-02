'use client';

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Send, 
  ArrowLeftRight,
  Wallet,
  Calculator,
  History,
  Building2,
  Menu, 
  Search, 
  Bell, 
  Sun,
  Moon,
  LogOut,
  Settings,
  ChevronRight,
  Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { CommandPalette } from "@/components/commands/CommandPalette";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCustomSidebar } from "@/components/providers/SidebarProvider";

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

const mainNav: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Send Money", href: "/send-money", icon: Send },
  { title: "Currency Exchange", href: "/exchange", icon: ArrowLeftRight },
  { title: "Client Balance", href: "/client-balance", icon: Wallet },
  { title: "Cash Register", href: "/cash-register", icon: Calculator },
  { title: "Transactions", href: "/transactions", icon: History },
  { title: "Payout", href: "/payout", icon: Building2 },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const { toggle, setIsOpen } = useCustomSidebar();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn(
      "min-h-screen bg-gray-50 dark:bg-gray-900",
      direction === "rtl" && "rtl"
    )}>
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsOpen}>
        <SheetContent side={direction === "rtl" ? "right" : "left"} className="w-[280px] p-0 rounded-r-2xl transition-transform duration-300 ease-ios">
          <div className="h-full ios-blur rounded-r-2xl">
            <div className="flex h-[70px] items-center px-6 border-b">
              <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl">
                <Banknote className="h-7 w-7" />
                Global Remit
              </Link>
            </div>
            <div className="py-6">
              <nav className="space-y-2 px-4">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "ios-nav-link group flex items-center gap-3 px-4 relative transition-all duration-200 ease-ios",
                      "hover:bg-primary/5 dark:hover:bg-primary/10",
                      "active:scale-[0.98] rounded-xl h-[48px]",
                      pathname === item.href && [
                        "ios-nav-link-active",
                        "bg-primary/10 dark:bg-primary/20",
                        "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                        "before:h-5 before:w-1 before:rounded-r-full before:bg-primary"
                      ]
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 transition-transform duration-200 ease-ios group-hover:scale-110" />
                    <span className="text-[15px] font-medium">{item.title}</span>
                    <ChevronRight className={cn(
                      "ml-auto h-5 w-5 opacity-0 transition-all duration-200 ease-ios group-hover:opacity-100",
                      direction === "rtl" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
                    )} />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "ios-sidebar hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-[280px]",
        direction === "rtl" && "left-auto right-0"
      )}>
        <div className="flex h-[70px] items-center px-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Banknote className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl ios-gradient-text">Global Remit</span>
          </Link>
        </div>
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="space-y-1 px-3">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "ios-nav-link group flex items-center gap-3 px-4 relative transition-all duration-200 ease-ios",
                  "hover:bg-primary/5 dark:hover:bg-primary/10",
                  "active:scale-[0.98] rounded-xl h-[48px]",
                  pathname === item.href && [
                    "ios-nav-link-active",
                    "bg-primary/10 dark:bg-primary/20",
                    "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                    "before:h-5 before:w-1 before:rounded-r-full before:bg-primary"
                  ]
                )}
              >
                <item.icon className="h-5 w-5 transition-transform duration-200 ease-ios group-hover:scale-110" />
                <span className="text-[15px] font-medium">{item.title}</span>
                <ChevronRight className={cn(
                  "ml-auto h-5 w-5 opacity-0 transition-all duration-200 ease-ios group-hover:opacity-100",
                  direction === "rtl" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
                )} />
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "lg:pl-[280px] min-h-screen",
        direction === "rtl" && "lg:pl-0 lg:pr-[280px]"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="flex h-[70px] items-center justify-between gap-6 px-4 lg:px-6">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl h-[40px] w-[40px] transition-colors duration-200 ease-ios active:scale-95"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              <div className="flex-1 w-full max-w-[800px]">
                <CommandPalette />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <NotificationCenter />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-[40px] w-[40px] transition-all duration-300 ease-ios active:scale-95"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-[40px] w-[40px] rounded-xl"
                  >
                    <Avatar className="h-[40px] w-[40px] rounded-xl">
                      <AvatarImage src="/images/avatar.svg" alt="Avatar" className="rounded-xl" />
                      <AvatarFallback className="bg-primary/10 text-primary rounded-xl text-[15px]">GR</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={direction === "rtl" ? "start" : "end"} className="w-[240px] rounded-xl">
                  <DropdownMenuItem className="rounded-lg h-[40px] text-[15px] transition-colors duration-200 ease-ios hover:bg-primary/5 dark:hover:bg-primary/10 focus:bg-primary/10 dark:focus:bg-primary/20">
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className={cn(
                        "h-5 w-5 transition-transform duration-200 ease-ios group-hover:scale-110",
                        direction === "rtl" ? "ml-3" : "mr-3"
                      )} />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 dark:text-red-400 rounded-lg h-[40px] text-[15px] transition-colors duration-200 ease-ios hover:bg-red-50 dark:hover:bg-red-950/20 focus:bg-red-100 dark:focus:bg-red-950/30">
                    <button 
                      onClick={logout}
                      className="flex items-center w-full"
                    >
                      <LogOut className={cn(
                        "h-5 w-5 transition-transform duration-200 ease-ios group-hover:scale-110",
                        direction === "rtl" ? "ml-3" : "mr-3"
                      )} />
                      <span>Log out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[calc(100vh-70px)] py-4 lg:py-6"
          >
            <div className="w-full px-4 lg:px-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {pathname === "/dashboard" ? t("dashboard.title") : ""}
                  </h1>
                  <p className="text-[15px] text-muted-foreground">
                    {t("dashboard.welcome")}
                  </p>
                </div>
              </div>
              <div className="w-full">
                {children}
              </div>
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppLayout;
