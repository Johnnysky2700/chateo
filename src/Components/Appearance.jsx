import { useTheme } from '../context/ThemeContext';
import { MdChevronLeft, MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

export default function Appearance() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  const handleLightMode = () => setDarkMode(false);
  const handleDarkMode = () => setDarkMode(true);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MdChevronLeft
          className="text-2xl cursor-pointer"
          onClick={() => navigate('/MorePage')}
        />
        <h1 className="text-2xl font-bold">Appearance</h1>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleLightMode}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
            !darkMode
              ? 'bg-blue-500 text-white'
              : 'bg-white text-black border-gray-300'
          }`}
        >
          <MdOutlineLightMode className="text-xl" />
          Light Mode
        </button>

        <button
          onClick={handleDarkMode}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all ${
            darkMode
              ? 'bg-blue-500 text-white'
              : 'bg-black text-white border-gray-700'
          }`}
        >
          <MdOutlineDarkMode className="text-xl" />
          Dark Mode
        </button>
      </div>
      <Footer />
    </div>
  );
}
