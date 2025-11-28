import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoBackspaceOutline } from "react-icons/io5";
import { MdChevronLeft } from "react-icons/md";
import { useAuth } from "../context/AuthContext"; // <-- Make sure this exists

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone } = location.state || {};
  const { login } = useAuth(); // AuthContext

  const [otp, setOtp] = useState("");
  const [showKeypad, setShowKeypad] = useState(true);

  const keypadNumbers = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "", "0", "backspace"
  ];

  // ✅ TEST NUMBERS & DUMMY USERS
  const testNumbers = {
    "+2349038163098": {
      code: "123456",
      user: {
        id: 1,
        phone: "+2349038163098",
        firstName: "Seyi",
        lastName: "Johnson",
        avatar: "",
        email: "seyi@example.com"
      }
    },
    "+15555550002": {
      code: "654321",
      user: {
        id: 2,
        phone: "+15555550002",
        firstName: "John",
        lastName: "Doe",
        avatar: "",
        email: "john@example.com"
      }
    }
  };

  const handleInput = async (value) => {
    if (value === "backspace") {
      setOtp((prev) => prev.slice(0, -1));
      return;
    }

    if (otp.length < 6) {
      const newOtp = otp + value;
      setOtp(newOtp);

      if (newOtp.length === 6) {
        try {
          // ✅ TEST NUMBER LOGIN
          if (testNumbers[phone]) {
            if (newOtp === testNumbers[phone].code) {
              // Save full dummy user to AuthContext
              login(testNumbers[phone].user);
              localStorage.setItem("registeredPhone", phone);
              localStorage.setItem("currentUser", JSON.stringify(testNumbers[phone].user));
              alert("Login successful!");
              navigate("/ContactPage");
            } else {
              alert("Invalid OTP for test number.");
              setOtp("");
            }
            return;
          }

          // ✅ FIREBASE CONFIRMATION
          const confirmationResult = window.confirmationResult;
          if (!confirmationResult) {
            alert("Session expired. Please request a new OTP.");
            navigate("/VerifyPage");
            return;
          }

          await confirmationResult.confirm(newOtp);

          // ✅ LOGIN WITH JSON SERVER
          await handleLogin(phone);

        } catch (error) {
          console.error("Invalid OTP:", error);
          alert("Invalid OTP. Please try again.");
          setOtp("");
        }
      }
    }
  };

  // 🔥 LOGIN FUNCTION (JSON SERVER)
  const handleLogin = async (phoneNumber) => {
    try {
      const res = await fetch(`http://localhost:5000/users?phone=${phoneNumber}`);
      const data = await res.json();

      let user;
      if (data.length > 0) {
        user = data[0]; // existing user
      } else {
        // create new user
        const newUser = {
          phone: phoneNumber,
          firstName: "",
          lastName: "",
          avatar: "",
          email: "",
        };

        const createRes = await fetch(`http://localhost:5000/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        user = await createRes.json();
      }

      // Save full user to AuthContext + localStorage
      login(user);
      localStorage.setItem("registeredPhone", phoneNumber);
      localStorage.setItem("currentUser", JSON.stringify(user));

      navigate("/ContactPage");

    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Try again.");
    }
  };

  const handleBack = () => navigate("/VerifyPage");
  const handleResend = () => {
    setOtp("");
    navigate("/VerifyPage");
  };

  useEffect(() => {
    setShowKeypad(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white relative text-black">
      <div>
        <button onClick={handleBack} className="text-2xl mb-6 pb-8">
          <MdChevronLeft />
        </button>

        <div className="flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold mb-2">Enter Code</h1>
          <p className="text-gray-500 mb-4 text-sm text-center">
            We have sent you an SMS with the code to <br />
            <span className="font-semibold">{phone}</span>
          </p>

          {/* OTP Circles */}
          <div className="flex gap-4 mb-6 pb-6 pt-6">
            {[0,1,2,3,4,5].map((index) => {
              const char = otp[index] || "";
              return (
                <div
                  key={index}
                  className={`w-6 h-6 flex items-center justify-center text-xl font-semibold
                    ${char ? "" : "rounded-full border-2 border-[#EDEDED] bg-[#EDEDED]"}`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleResend}
          className="w-full text-primary py-3 text-sm transition mb-8"
        >
          Resend Code
        </button>
      </div>

      {/* Keypad */}
      {showKeypad && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#F7F7FC] shadow-2xl text-black">
          <div className="grid grid-cols-3 gap-4 text-2xl text-center p-2">
            {keypadNumbers.map((key, idx) => (
              <button
                key={idx}
                onClick={() => key && handleInput(key)}
                className="py-2 bg-[#F7F7FC] hover:bg-gray-200"
              >
                {key === "backspace"
                  ? <IoBackspaceOutline className="mx-auto" />
                  : key}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
