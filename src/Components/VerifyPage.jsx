import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";

export default function VerifyPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const domain = "@gmail.com";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) navigate("/ContactPage");
  }, [navigate]);

  const handleContinue = async () => {
    if (!username || username.length < 2) {
      alert("Enter a valid username.");
      return;
    }

    const email = username.includes("@") ? username : username + domain;

    try {
      // ✅ Use the full backend URL
      const response = await fetch(
        "https://chateo-ml7k.onrender.com/request-otp", 
        {
          method: "POST",            // POST is required
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const contacts = await response.json();
      console.log(contacts);

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to send OTP.");
        return;
      }

      alert("OTP sent to your email!");
      navigate("/OtpPage", { state: { email } });

    } catch (error) {
      console.error("OTP SEND ERROR:", error);
      alert(
        "Failed to send OTP. Make sure your backend is running and accessible."
      );
    }
  };

  const handleBack = () => navigate("/WalkThrough");

  return (
    <div className="flex flex-col min-h-screen justify-between bg-white dark:bg-black text-black dark:text-white p-6">
      <div>
        <button onClick={handleBack} className="text-2xl mb-6">
          <MdChevronLeft />
        </button>

        <h1 className="text-2xl pt-12 font-bold mb-2">Email Verification</h1>

        <p className="mb-6 text-center">
          Enter your Gmail username (your email will become username{domain})
        </p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Gmail username"
          className="w-full bg-[#F7F7FC] dark:bg-gray-900 px-4 py-4 rounded-xl text-lg outline-none"
        />

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-full text-[16px] hover:bg-blue-700 mt-6"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
