import { useEffect } from 'react';
import { FiSun, FiHelpCircle, FiMail } from 'react-icons/fi';
import { RiChat3Line, RiUserLine, RiFolder3Line } from 'react-icons/ri';
import { MdNotificationsNone, MdOutlinePrivacyTip, MdChevronRight } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

export default function MorePage() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Set default user ID if not found in localStorage
  useEffect(() => {
    if (!localStorage.getItem("currentUserId")) {
      localStorage.setItem("currentUserId", "1");
    }
  }, []);

  const menuItems = [
    { label: 'Account', icon: <RiUserLine />, path: '/Account' },
    { label: 'Chats', icon: <RiChat3Line /> },
    { label: 'Appearance', icon: <FiSun />, path: '/Appearance' },
    { label: 'Notification', icon: <MdNotificationsNone /> },
    { label: 'Privacy', icon: <MdOutlinePrivacyTip /> },
    { divider: true },
    { label: 'Data Usage', icon: <RiFolder3Line /> },
    { label: 'Help', icon: <FiHelpCircle /> },
    { label: 'Invite Your Friends', icon: <FiMail /> },
  ];

  return (
    <div className={`min-h-screen p-4 pb-24 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold mb-6">More</h1>

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
          <RiUserLine />
        </div>
        <div>
          <p className="font-semibold">Almayra Zamzamy</p>
          <p className="text-gray-400 text-sm">+62 1309 - 1710 - 1920</p>
        </div>
        <div className="ml-auto text-2xl">
          <MdChevronRight />
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-6">
        {menuItems.map((item, index) =>
          item.divider ? (
            <hr key={index} className="border-t border-gray-300 dark:border-gray-600" />
          ) : (
            <div
              key={index}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                }
              }}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="text-2xl">{item.icon}</span>
                {item.label}
              </div>
              <MdChevronRight className="text-2xl" />
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
}
