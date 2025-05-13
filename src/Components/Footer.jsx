import { NavLink } from 'react-router-dom';
import { RiGroupLine, RiChat3Line } from 'react-icons/ri';
import { FiMoreHorizontal } from 'react-icons/fi';

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t shadow-inner flex justify-around py-6 bg-white text-black dark:bg-black dark:text-white">
      <NavLink
        to="/ContactPage"
        className={({ isActive }) =>
          `text-2xl ${isActive ? 'text-blue-500' : 'text-gray-500'}`
        }
      >
        <RiGroupLine />
      </NavLink>
      <NavLink
        to="/ChatPage"
        className={({ isActive }) =>
          `text-2xl ${isActive ? 'text-blue-500' : 'text-gray-500'}`
        }
      >
        <RiChat3Line />
      </NavLink>
      <NavLink
        to="/MorePage"
        className={({ isActive }) =>
          `text-2xl ${isActive ? 'text-blue-500' : 'text-gray-500'}`
        }
      >
        <FiMoreHorizontal />
      </NavLink>
    </div>
  );
}