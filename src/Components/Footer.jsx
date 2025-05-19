import { NavLink } from 'react-router-dom';
import { RiGroupLine, RiChat3Line } from 'react-icons/ri';
import { FiMoreHorizontal } from 'react-icons/fi';

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t shadow-inner flex justify-around py-4 bg-white text-black dark:bg-black dark:text-[#F7F7FC]">
      
      <NavLink
        to="/ContactPage"
        className={({ isActive }) =>
          `flex flex-col items-center text-2xl ${isActive ? 'text-[#0A0A18]' : 'text-gray-500'}`
        }
      >
        {({ isActive }) => (
          <>
            {!isActive && <RiGroupLine />}
            {isActive && (
              <>
                <span className="text-sm mt-1">Contacts</span>
                <div className="w-2 h-2 rounded-full bg-[#0A0A18] mt-1" />
              </>
            )}
          </>
        )}
      </NavLink>

      <NavLink
        to="/ChatPage"
        className={({ isActive }) =>
          `flex flex-col items-center text-2xl ${isActive ? 'text-[#0A0A18]' : 'text-gray-500'}`
        }
      >
        {({ isActive }) => (
          <>
            {!isActive && <RiChat3Line />}
            {isActive && (
              <>
                <span className="text-sm mt-1">Chats</span>
                <div className="w-2 h-2 rounded-full bg-[#0A0A18] mt-1" />
              </>
            )}
          </>
        )}
      </NavLink>

      <NavLink
        to="/MorePage"
        className={({ isActive }) =>
          `flex flex-col items-center text-2xl ${isActive ? 'text-[#0A0A18]' : 'text-gray-500'}`
        }
      >
        {({ isActive }) => (
          <>
            {!isActive && <FiMoreHorizontal />}
            {isActive && (
              <>
                <span className="text-sm mt-1">More</span>
                <div className="w-2 h-2 rounded-full bg-[#0A0A18] mt-1" />
              </>
            )}
          </>
        )}
      </NavLink>

    </div>
  );
}
