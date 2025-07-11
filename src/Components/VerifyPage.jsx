import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import { IoBackspaceOutline } from "react-icons/io5";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { AuthContext } from "../context/AuthContext";

export default function VerifyPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      navigate("/ContactPage");
    }
  }, [navigate]);

  const handleInput = (value) => {
    if (value === "backspace") {
      setPhoneNumber((prev) => prev.slice(0, -1));
    } else {
      setPhoneNumber((prev) => prev + value);
    }
  };

  const handleContinue = async () => {
    if (phoneNumber.length < 7) {
      alert("Please enter a valid phone number.");
      return;
    }

    const fullPhoneNumber = "+" + phoneNumber;

    try {
      const res = await fetch("http://localhost:8000/contacts");
      const contacts = await res.json();
      const exactContact = contacts.find(
        (c) => c.phone && "+" + c.phone.trim() === fullPhoneNumber.trim()
      );

      let user;

      if (exactContact) {
        const userRes = await fetch(`http://localhost:8000/users?phone=${exactContact.phone}`);
        const existingUser = await userRes.json();

        if (existingUser.length > 0) {
          user = existingUser[0];
        } else {
          const newUser = {
            firstName: exactContact.name?.split(" ")[0] || "",
            lastName: exactContact.name?.split(" ").slice(1).join(" ") || "",
            phone: exactContact.phone,
            avatar: exactContact.avatar || null,
            email: "",
            address: "",
            country: "",
          };

          const createRes = await fetch("http://localhost:8000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          });
          user = await createRes.json();
        }
      }

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("currentUserId", user.id);
        login(user);
        navigate("/ContactPage");
      } else {
        navigate("/OtpPage", { state: { phone: fullPhoneNumber } });
      }
    } catch (error) {
      console.error("Error verifying phone:", error);
      alert("An error occurred during verification. Please try again.");
    }
  };

  const handleBack = () => navigate("/WalkThrough");

  const keypadNumbers = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "", "0", "backspace"
  ];

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white dark:bg-black text-black dark:text-white">
      <div>
        <button onClick={handleBack} className="text-2xl mb-6">
          <MdChevronLeft />
        </button>

        <h1 className="text-2xl pt-12 font-bold mb-2">Enter Your Phone Number</h1>
        <p className="mb-6 text-center">
          Please confirm your country code and enter your phone number
        </p>

        <div className="mb-6 pt-4 pb-8" onClick={() => setShowKeypad(true)}>
          <PhoneInput
            country={"id"}
            value={phoneNumber}
            onChange={setPhoneNumber}
            inputProps={{
              name: "phone",
              required: true,
              readOnly: true,
              onFocus: () => setShowKeypad(true),
            }}
            placeholder="Phone Number"
            containerStyle={{ width: "100%", backgroundColor: "#F7F7FC" }}
            inputStyle={{
              width: "100%",
              border: "none",
              borderRadius: 0,
              fontSize: "1rem",
              backgroundColor: "#F7F7FC",
              color: "inherit",
            }}
            buttonStyle={{ backgroundColor: "#F7F7FC" }}
            dropdownStyle={{ color: "black" }}
            enableSearch
          />
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-full text-[16px] hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>

      {showKeypad && (
        <div className="grid grid-cols-3 gap-4 text-2xl text-center mt-6 bg-[#F7F7FC] dark:bg-black p-2 absolute bottom-0 w-full left-0">
          {keypadNumbers.map((key, idx) => (
            <button
              key={idx}
              onClick={() => key && handleInput(key)}
              className="py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-black dark:text-white"
            >
              {key === "backspace" ? (
                <IoBackspaceOutline className="mx-auto" />
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
