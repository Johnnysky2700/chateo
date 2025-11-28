// ✅ VERIFY PAGE (FINAL FIXED VERSION)

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import { IoBackspaceOutline } from "react-icons/io5";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import app, { auth as firebaseAuth } from "../firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber, getAuth } from "firebase/auth";

export default function VerifyPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);

  // 🔹 DEVELOPMENT TEST NUMBERS
  const testNumbers = {
    "+2349038163098": "123456",
    "+15555550002": "654321",
  };

  // 🔧 Fix: Ensure auth.settings exists so Firebase does not break
  const ensureAuthSettings = (authInstance) => {
    if (!authInstance) return authInstance;

    if (typeof authInstance.settings === "undefined") {
      try {
        authInstance.settings = {};
      } catch (err) {
        try {
          Object.defineProperty(authInstance, "settings", {
            value: {},
            writable: true,
            configurable: true,
            enumerable: true,
          });
        } catch (err2) {
          console.warn("Failed to create auth.settings:", err2);
        }
      }
    }
    return authInstance;
  };

  // 🔧 Initialize recaptcha once
  useEffect(() => {
    const initRecaptcha = async () => {
      const authInstance = ensureAuthSettings(firebaseAuth || getAuth(app));

      // ONLY localhost allowed to disable verification
      if (window.location.hostname === "localhost") {
        try {
          authInstance.settings.appVerificationDisabledForTesting = true;
        } catch (err) {
          console.warn("Could not disable verification:", err);
        }
      }

      if (!window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
              size: "invisible",
              callback: () => console.log("Recaptcha solved"),
            },
            authInstance
          );

          await window.recaptchaVerifier.render();
        } catch (err) {
          console.error("Recaptcha init error:", err);
        }
      }
    };

    initRecaptcha();

    // auto-login
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) navigate("/ContactPage");
  }, [navigate]);

  const handleInput = (value) => {
    if (value === "backspace") {
      setPhoneNumber((prev) => prev.slice(0, -1));
      return;
    }
    setPhoneNumber((prev) => prev + value);
  };

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      alert("Please enter a valid phone number.");
      return;
    }

    const fullPhone = `+${phoneNumber}`;
    const authInstance = ensureAuthSettings(firebaseAuth || getAuth(app));
    const appVerifier = window.recaptchaVerifier;

    try {
      // 🔥 TEST NUMBER BYPASS
      if (testNumbers[fullPhone]) {
        alert(`TEST NUMBER! Use OTP: ${testNumbers[fullPhone]}`);
        navigate("/OtpPage", { state: { phone: fullPhone } });
        return;
      }

      await appVerifier.render();

      const confirmationResult = await signInWithPhoneNumber(
        authInstance,
        fullPhone,
        appVerifier
      );

      window.confirmationResult = confirmationResult;

      alert("OTP sent!");
      navigate("/OtpPage", { state: { phone: fullPhone } });

    } catch (error) {
      console.error("OTP SEND ERROR:", error);

      if (error.code === "auth/network-request-failed") {
        alert("Network error. Check your internet connection.");
      } else if (error.code === "auth/invalid-phone-number") {
        alert("Invalid phone number format.");
      } else if (error.code === "auth/quota-exceeded") {
        alert("SMS quota exceeded. Try later.");
      } else {
        alert(`Failed to send OTP: ${error.message}`);
      }
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
            country={"ng"}
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
              fontSize: "1rem",
              backgroundColor: "#F7F7FC",
            }}
            buttonStyle={{ backgroundColor: "#F7F7FC" }}
            dropdownStyle={{ color: "black" }}
            enableSearch
          />
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-full text-[16px] hover:bg-blue-700"
        >
          Continue
        </button>

        <div id="recaptcha-container"></div>
      </div>

      {showKeypad && (
        <div className="grid grid-cols-3 gap-4 text-2xl text-center mt-6 bg-[#F7F7FC] dark:bg-black p-2 absolute bottom-0 w-full left-0">
          {keypadNumbers.map((key, idx) => (
            <button
              key={idx}
              onClick={() => key && handleInput(key)}
              className="py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {key === "backspace"
                ? <IoBackspaceOutline className="mx-auto" />
                : key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
