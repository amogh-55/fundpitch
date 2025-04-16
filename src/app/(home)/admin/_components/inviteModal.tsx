import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Twitter } from "lucide-react";

interface InviteModalProps {
  show: boolean;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ show, onClose }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      setEmails([...emails, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setPhoneNumber(value);
  };

  const handleSendInvite = () => {
    if (phoneNumber) {
      console.log("Phone Number:", `+91${phoneNumber}`);
    } else if (emails.length > 0) {
      console.log("Emails:", emails);
    } else {
      console.log("No input provided");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 overflow-hidden">
      <div className="bg-white rounded-xl shadow-lg w-2/5 p-6 py-10 relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-black" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-2">Invite</h2>
        <p className="text-sm text-gray-600 mb-4">
          Add your members to collaborate on this project. Each will receive an invitation via email.
        </p>
        <hr className="mb-4" />
        <div className="mb-4 relative">
          <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <div className="absolute  left-0 top-3 flex items-center pl-12 text-gray-700">+91</div>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg  pl-20 bg-[#F4F4F5]"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            <img src="/assets/images/whatsappicon.png" alt="" className=" text-green-500 w-5 h-5 absolute bottom-4 left-4" />
            {/* <Twitter className="absolute left-[-6] top-12 text-green-500" size={20} /> */}
          </div>
        </div>
        <span className="flex flex-row justify-center items-center">
        <hr className="w-1/2  "/>
        <div className="text-center text-gray-500 mb-4 mx-2 relative top-2"> OR </div> <hr className="w-1/2"/>
        </span>
        
        <label className="block text-sm text-black mb-2 font-semibold">Enter emails <span className="text-gray-500">*</span></label>
        <input
          type="email"
          className="w-full border border-gray-300 p-3 rounded-lg    mb-4 bg-[#F4F4F5]"
          placeholder="Enter email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyDown={handleAddEmail}
        />
        <div className="flex flex-wrap gap-2 mb-4">
          {emails.map((email, index) => (
            <div key={index} className="bg-transparent border-2 px-2 py-2 mb-2 rounded-full flex items-center gap-2">
              {email}
              <X className="cursor-pointer font-medium" size={16} onClick={() => handleRemoveEmail(email)} />
            </div>
          ))}
        </div>
        <hr className="mb-4" />
        <div className="flex justify-between  mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-[#1F5EFF] hover:bg-[#1f5fffdd] shadow-md rounded-xl" onClick={handleSendInvite}>Send Invites</Button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;