import { NavLink } from 'react-router-dom';
import { RiGroupLine, RiChat3Line } from 'react-icons/ri';
import { FiMoreHorizontal } from 'react-icons/fi';

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t shadow-inner flex justify-around py-4 bg-white text-black dark:bg-black dark:text-white">
      
      <NavLink
        to="/ContactPage"
        className="flex flex-col items-center text-2xl"
      >
        {({ isActive }) => (
          <>
            {!isActive ? (
              <RiGroupLine className="text-black dark:text-white" />
            ) : (
              <>
                <span className="text-sm mt-1 text-[#0A0A18] dark:text-white">Contacts</span>
                <div className="w-2 h-2 rounded-full bg-[#0A0A18] dark:bg-white mt-1" />
              </>
            )}
          </>
        )}
      </NavLink>

      <NavLink
        to="/ChatPage"
        className="flex flex-col items-center text-2xl"
      >
        {({ isActive }) => (
          <>
            {!isActive ? (
              <RiChat3Line className="text-black dark:text-white" />
            ) : (
              <>
                <span className="text-sm mt-1 text-[#0A0A18] dark:text-white">Chats</span>
                <div className="w-2 h-2 rounded-full bg-[#0A0A18] dark:bg-white mt-1" />
              </>
            )}
          </>
        )}
      </NavLink>

      <NavLink
        to="/MorePage"
        className="flex flex-col items-center text-2xl"
      >
        {({ isActive }) => (
          <>
            {!isActive ? (
              <FiMoreHorizontal className="text-black dark:text-white" />
            ) : (
              <>
                <span className="text-sm mt-1 text-[#0A0A18] dark:text-white">More</span>
                <div className="w-2 h-2 rounded-full bg-[#0A0A18] dark:bg-white mt-1" />
              </>
            )}
          </>
        )}
      </NavLink>

    </div>
  );
}
