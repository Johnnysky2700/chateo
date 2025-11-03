import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdChevronLeft, MdEdit } from 'react-icons/md';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

export default function Account() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  const [user, setUser] = useState(currentUser || {});
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(!currentUser);

  useEffect(() => {
    if (!currentUser) {
      const storedUser = JSON.parse(localStorage.getItem('currentUser'));
      if (storedUser) {
        setUser(storedUser);
        setAvatar(storedUser.avatar || null);
      }
      setLoading(false);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 300,
        useWebWorker: true,
      });

      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      setAvatar(base64);
      setUser((prev) => ({ ...prev, avatar: base64 }));
    } catch (error) {
      console.error('Image compression failed:', error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, avatar }),
      });

      if (!res.ok) throw new Error('Failed to save user info');

      const updatedUser = await res.json();
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      alert('Account info saved!');
      navigate('/MorePage');
    } catch (err) {
      console.error(err);
      alert('Error saving user info');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-white text-black dark:bg-black dark:text-white pb-24">
      <div className="flex items-center gap-3 fixed w-full left-0 top-0 p-2 bg-white dark:bg-black z-20">
        <MdChevronLeft
          className="text-2xl cursor-pointer mb-6"
          onClick={() => navigate('/MorePage')}
        />
        <h1 className="text-2xl font-bold mb-6">Edit Account</h1>
      </div>

      <div className="relative w-24 h-24 mx-auto mb-6 mt-16">
        <img
          src={avatar || '/default-avatar.png'}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
        />
        <label className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full cursor-pointer dark:bg-gray-700">
          <MdEdit className="text-black dark:text-white" />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="space-y-5">
        {['firstName', 'lastName', 'email', 'phone', 'address', 'country'].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize mb-1" htmlFor={field}>
              {field === 'email' ? 'Gmail' : field}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              value={user[field] || ''}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-white"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Save
        </button>
      </div>

      <Footer />
    </div>
  );
}
