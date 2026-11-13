import { Bell, CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useNotifications } from "../../../application/context/notificationContext";
import { formatRelativeTime } from "../../../shared/utils/dateUtils";

interface NotificationComponentProps {
      setIsNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ setIsNotificationOpen }) => {
      const { notifications, unreadCount, loading, markAsRead } = useNotifications();
      const navigate = useNavigate();

      const handleOpen = (notification: (typeof notifications)[number]) => {
            if (!notification.isRead) {
                  void markAsRead(notification.id);
            }

            setIsNotificationOpen(false);
            navigate(notification.link ?? "/dashboard");
      };

      return (
            <>
                  {/* Overlay */}
                  <div
                        className="fixed inset-0 z-40 bg-black/5"
                        onClick={() => setIsNotificationOpen(false)}
                  />

                  {/* Panneau */}
                  <div className="absolute top-12 right-0 md:right-10 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-2xl z-50">

                        <div className="p-4 border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg text-dark">Notifications</h3>
                                    <span className="bg-primary-flow text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                                          {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                                    </span>
                              </div>
                        </div>

                        <div className="max-h-[420px] overflow-y-auto">
                              {loading && notifications.length === 0 && (
                                    <div className="flex justify-center items-center py-10">
                                          <span className="w-8 h-8 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                                    </div>
                              )}

                              {!loading && notifications.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                          <Bell className="w-8 h-8 text-gray-300 mb-2" />
                                          <p className="text-sm text-gray-500">Aucune notification pour le moment.</p>
                                    </div>
                              )}

                              {notifications.map((notification) => (
                                    <button
                                          key={notification.id}
                                          type="button"
                                          onClick={() => handleOpen(notification)}
                                          className={`w-full text-left p-4 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer ${
                                                notification.isRead ? "bg-white hover:bg-gray-50" : "bg-primary-flow/40 hover:bg-primary-flow/60"
                                          }`}
                                    >
                                          <div className="flex gap-3">
                                                <span
                                                      className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${
                                                            notification.isRead
                                                                  ? "bg-gray-50 text-gray-400 border-gray-200"
                                                                  : "bg-blue-50 text-blue-600 border-blue-200"
                                                      }`}
                                                >
                                                      {notification.isRead ? (
                                                            <CheckCircle2 className="w-5 h-5" />
                                                      ) : (
                                                            <Bell className="w-5 h-5" />
                                                      )}
                                                </span>

                                                <div className="flex-1 min-w-0">
                                                      <div className="flex items-start justify-between gap-2">
                                                            <p className="font-semibold text-sm text-dark line-clamp-1">
                                                                  {notification.title}
                                                            </p>
                                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                  {formatRelativeTime(notification.createdAt)}
                                                            </span>
                                                      </div>

                                                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                                            {notification.message}
                                                      </p>
                                                </div>

                                                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 self-center" />
                                          </div>
                                    </button>
                              ))}
                        </div>

                        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                              <Button
                                    variant="ghost"
                                    size="sm"
                                    fullWidth
                                    className="text-primary hover:bg-blue-50 font-medium"
                                    onClick={() => setIsNotificationOpen(false)}
                              >
                                    Fermer
                              </Button>
                        </div>
                  </div>
            </>
      );
};

export default NotificationComponent;
