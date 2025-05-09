import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import { RiChat3Line, RiUserLine } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiFillPlusCircle } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:8000/contacts");
        const data = await res.json();
        setContacts(data);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) =>
    contact?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddContact = async () => {
    if (
      !firstName.trim() ||
      !middleName.trim() ||
      !lastName.trim() ||
      !phone.trim()
    ) {
      alert("All fields are required");
      return;
    }

    const newContact = {
      name: `${firstName} ${middleName} ${lastName}`,
      initials: `${firstName[0] || ""}${lastName[0] || ""}`,
      phone,
      status: "New Contact",
      online: false,
      avatar,
    };

    try {
      const res = await fetch("http://localhost:8000/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      });

      if (res.ok) {
        const saved = await res.json();
        setContacts((prev) => [...prev, saved]);
        setShowModal(false);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setPhone("");
        setAvatar(null);
      } else {
        alert("Failed to add contact");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 pb-24 relative text-black dark:bg-black dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 py-4">
        <h1 className="text-xl">Contacts</h1>
        <button className="text-2xl" onClick={() => setShowModal(true)}>
          <HiPlus />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md"
          placeholder="Search"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {/* Contact List */}
      <ul>
        {filteredContacts.map((contact) => (
          <li
            key={contact.id}
            className="flex items-center gap-3 py-3 border-b"
          >
            {contact.avatar ? (
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
            ) : (
              <div className="relative bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold">
                {contact.initials}
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
            )}
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-gray-400">{contact.phone}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Add New Contact
            </h2>

            {/* Avatar Upload */}
            <div className="flex justify-center mb-4">
              <div
                className="relative"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-24 h-24 bg-[#F7F7FC] rounded-full flex items-center justify-center text-4xl text-gray-600">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <RiUserLine />
                  )}
                </div>
                <div className="absolute bottom-0 right-0">
                  <AiFillPlusCircle className="text-2xl text-blue-500 bg-white rounded-full" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Inputs */}
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full p-2 mb-2 rounded bg-[#F7F7FC] dark:bg-gray-800"
            />
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Middle Name"
              className="w-full p-2 mb-2 rounded bg-[#F7F7FC] dark:bg-gray-800"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full p-2 mb-2 rounded bg-[#F7F7FC] dark:bg-gray-800"
            />
            <div className="mb-6">
              <PhoneInput
                country={"id"}
                value={phone}
                onChange={setPhone}
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                placeholder="Phone Number"
                containerStyle={{ width: "100%" }}
                inputStyle={{
                  width: "100%",
                  backgroundColor: "#F7F7FC",
                  color: "inherit",
                }}
              />
            </div>

            {/* Buttons */}
            <button
              onClick={handleAddContact}
              className="w-full bg-blue-600 text-white py-2 rounded mb-2"
            >
              Save
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-6 text-black dark:bg-black dark:text-white">
        <button className="text-sm">Contacts</button>
        <button
          className="text-center text-sm"
          onClick={() => navigate("/ChatPage")}
        >
          <span className="block text-2xl">
            <RiChat3Line />
          </span>
        </button>
        <button
          className="text-center text-sm"
          onClick={() => navigate("/MorePage")}
        >
          <span className="block text-2xl">
            <FiMoreHorizontal />
          </span>
        </button>
      </div>
    </div>
  );
}
