"use client"

import { useEffect, useState } from "react"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notificationService, Notification } from "@/lib/notification-service"
import { useUser } from "@/hooks/useUser"
import { useFirebaseAuth } from "@/config/firebase/firebase-auth-provider"

export function DashboardHeader() {
  const { user } = useUser();
  const { auth } = useFirebaseAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !auth?.currentUser) return;

    // Solicitar permiso para notificaciones push
    const setupNotifications = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (token) {
          await notificationService.requestPermissionAndRegister(token);
        }
      } catch (error) {
        console.error('Error al configurar notificaciones:', error);
      }
    };
    setupNotifications();

    // Suscribirse a notificaciones en tiempo real
    const unsubscribe = notificationService.subscribeToUserNotifications(
      user.id,
      user.userType,
      (updatedNotifications) => {
        setNotifications(updatedNotifications);
        setIsLoading(false);
      }
    );

    // Escuchar notificaciones en primer plano
    const unsubscribeForeground = notificationService.listenToNotifications((notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      unsubscribe();
      unsubscribeForeground();
    };
  }, [user, auth?.currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.id && !notification.read && auth?.currentUser) {
      const token = await auth.currentUser.getIdToken();
      await notificationService.markAsRead(notification.id, token);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <Link href="/dashboard" className="lg:hidden">
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full bg-white shadow-none appearance-none pl-8 dark:bg-gray-950"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notificaciones</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <div className="py-4 text-center text-sm text-gray-500">Cargando notificaciones...</div>
          ) : notifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">No hay notificaciones</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="font-medium text-sm">{notification.title}</div>
                <div className="text-xs text-gray-500 mt-1">{notification.message}</div>
                {notification.type !== 'info' && (
                  <Badge
                    variant={
                      notification.type === 'success' ? 'default' :
                      notification.type === 'warning' ? 'secondary' :
                      'destructive'
                    }
                    className="mt-2"
                  >
                    {notification.type}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="w-full text-center text-sm text-blue-600">
              Ver todas las notificaciones
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
