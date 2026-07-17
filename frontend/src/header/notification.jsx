import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"
import { getNotificationById, readNotificationByid } from "../api/notification"

function Notification({ UserId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotif = async () => {
            try {
                const res = await getNotificationById(parseInt(UserId));
                setNotifications(res.data);
            } catch (err) {
                console.log(err);
                setError("Failed to load notifications");
            } finally {
                setLoading(false);
            }
        };
        fetchNotif();
    }, [UserId]);

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = async (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {

                if (isOpen && unreadCount > 0) {
                    await readNotificationById(UserId);

                    setNotifications(prev =>
                        prev.map(n => ({
                            ...n,
                            isRead: true
                        }))
                    );
                }

                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleNotificationClick = async () => {
        if (isOpen) {
            // Dropdown is about to close
            if (unreadCount > 0) {
                try {
                    await readNotificationByid(UserId);

                    setNotifications(prev =>
                        prev.map(n => ({
                            ...n,
                            isRead: true
                        }))
                    );
                } catch (err) {
                    console.error(err);
                }
            }
        }

        setIsOpen(prev => !prev);
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                onClick={handleNotificationClick}
                className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
                <Bell size={22} className="text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-9 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {loading && (
                        <div className="p-3 text-sm text-gray-500">Loading...</div>
                    )}
                    {error && (
                        <div className="p-3 text-sm text-red-500">{error}</div>
                    )}
                    {!loading && !error && notifications.length === 0 && (
                        <div className="p-3 text-sm text-gray-500">No notifications yet.</div>
                    )}
                    {!loading &&
                        !error &&
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${n.isRead ? "bg-white" : "bg-blue-50"
                                    }`}
                            >
                                <p
                                    className={`text-sm text-gray-800 ${n.isRead ? "font-normal" : "font-semibold"
                                        }`}
                                >
                                    {n.message}
                                </p>
                                <small className="text-xs text-gray-400">
                                    {new Date(n.createdAt).toLocaleString()}
                                </small>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default Notification;