import React, { useState, useEffect, useCallback } from 'react';
import "./index.css";

const App = () => {
  // State hooks
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('Weak');
  const [length, setLength] = useState(8); // State for slider length
  const [includeSymbols, setIncludeSymbols] = useState(true); // State for symbols

  // Function to handle user input
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handleBirthdateChange = (e) => setBirthdate(e.target.value);
  const handleLengthChange = (e) => setLength(e.target.value);
  const handleIncludeSymbolsChange = (e) => setIncludeSymbols(e.target.checked);

  // Function to calculate password strength
  const calculateStrength = useCallback((pass) => {
    if (pass.length < 8) return 'Weak';
    if (pass.length >= 8 && pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.match(/[^A-Za-z0-9]/)) {
      return 'Strong';
    }
    return 'Medium';
  }, []);

  // Function to generate a random password
  const generatePassword = useCallback(() => {
    // Ensure at least one input is provided
    if (!username && !phoneNumber && !birthdate) {
      setPassword(''); // No password if all inputs are empty
      setStrength('Weak');
      return;
    }

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const characters = includeSymbols ? letters + symbols : letters;

    // Create a base password using available inputs
    let basePassword = '';
    if (username) basePassword += username.slice(0, 3); // First 3 letters of username
    if (phoneNumber) basePassword += phoneNumber.slice(-3); // Last 3 digits of phone number
    if (birthdate) basePassword += birthdate.replace(/-/g, ''); // Birthdate without dashes

    // Fill the rest with random characters if basePassword is shorter than desired length
    while (basePassword.length < length) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      basePassword += characters[randomIndex];
    }

    // Truncate to the desired length
    const randomPassword = basePassword.slice(0, length);

    setPassword(randomPassword);
    setStrength(calculateStrength(randomPassword));
  }, [length, includeSymbols, username, phoneNumber, birthdate, calculateStrength]);

  // Automatically generate password whenever relevant input changes
  useEffect(() => {
    generatePassword();
  }, [length, includeSymbols, username, phoneNumber, birthdate, generatePassword]);

  // Function to copy password to clipboard
  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      alert("Password copied to clipboard!");
    } else {
      alert("No password to copy!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        <h1 className="text-xl font-semibold text-center mb-4">Password Generator</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Username</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Birthdate</label>
          <input
            type="date"
            value={birthdate}
            onChange={handleBirthdateChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Password Length</label>
          <input
            type="range"
            min="8"
            max="28"
            value={length}
            onChange={handleLengthChange}
            className="w-full"
          />
          <p className="text-sm text-gray-500 text-center">Length: {length}</p>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={handleIncludeSymbolsChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-600">Include Symbols</label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Generated Password</label>
          <input
            type="text"
            value={password}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">Password Strength: {strength}</p>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Copy Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
