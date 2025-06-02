import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdChevronLeft } from "react-icons/md";
import Footer from './Footer';

export default function Account() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("currentUserId");

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    country: '',
  });

  const [loading, setLoading] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    if (!userId) {
      alert("No user ID found.");
      navigate('/MorePage');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users/${userId}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load user data:", err);
        alert("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error('Failed to save user info');

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
    <div className="min-h-screen p-6 bg-white text-black dark:bg-black dark:text-white">
      <div className="flex items-center gap-3">
        <MdChevronLeft
          className="text-2xl cursor-pointer mb-6"
          onClick={() => navigate('/MorePage')}
        />
      <h1 className="text-2xl font-bold mb-6">Edit Account</h1>
      </div>
      <div className="space-y-5">
        {['firstName', 'lastName', 'email', 'address', 'country'].map((field) => (
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
