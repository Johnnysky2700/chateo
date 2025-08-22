import { useState } from 'react';
import { FiSun, FiHelpCircle, FiMail } from 'react-icons/fi';
import { RiChat3Line, RiUserLine, RiFolder3Line } from 'react-icons/ri';
import { MdNotificationsNone, MdOutlinePrivacyTip, MdChevronRight } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

export default function MorePage() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/VerifyPage');
  };

  const menuItems = [
    { label: 'Account', icon: <RiUserLine />, path: '/Account' },
    { label: 'Chats', icon: <RiChat3Line />, path: '/Chats' },
    { label: 'Appearance', icon: <FiSun />, path: '/Appearance' },
    { label: 'Notification', icon: <MdNotificationsNone />, path: '/Notification' },
    { label: 'Privacy', icon: <MdOutlinePrivacyTip />, path: '/Privacy' },
    { divider: true },
    { label: 'Data Usage', icon: <RiFolder3Line />, path: '/DataUsage' },
    { label: 'Help', icon: <FiHelpCircle />, path: '/Help' },
    { label: 'Invite Your Friends', icon: <FiMail />, path: '/InviteFriends' },
  ];

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 pb-24 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div>
        <h1 className="text-2xl font-bold mb-6 fixed top-0 left-0 w-full bg-white dark:bg-black p-2">More</h1>

        {/* Profile Section */}
        {currentUser && (
          <div className="flex items-center gap-4 mb-6 mt-16">
            <div
              className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer"
              onClick={() => setPreviewOpen(true)}
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <RiUserLine className="w-full h-full p-2 text-gray-500" />
              )}
            </div>
            <div>
              <p className="font-semibold">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-gray-400 text-sm">
                +{currentUser.phone || '...'}
              </p>
            </div>
          </div>
        )}

        {/* Menu List */}
        <div className="space-y-6">
          {menuItems.map((item, index) =>
            item.divider ? (
              <hr
                key={index}
                className="border-t border-gray-300 dark:border-gray-600"
              />
            ) : (
              <div
                key={index}
                onClick={() => item.path && navigate(item.path)}
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
      </div>

      {/* Logout Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm"
        >
          Logout
        </button>
      </div>

      <Footer />

      {/* Avatar Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewOpen(false)}
        >
          <img
            src={currentUser.avatar}
            alt="Avatar Preview"
            className="w-96 h-96 rounded-full shadow-full"
          />
        </div>
      )}
    </div>
  );
}
