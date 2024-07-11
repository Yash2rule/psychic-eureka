import React, { useEffect, useState } from "react";
import { useReplyStore } from "./store/useReplyStore";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaPaperPlane,
  FaStop,
  FaMicrophone,
  FaVolumeUp,
  FaEnvelope,
  FaRegCopy,
  FaEdit,
  FaSearch,
  FaSave,
  FaSync,
} from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import ReactQuill from "react-quill";
import Modal from "react-modal";
import "react-quill/dist/quill.snow.css";

const ReplyAssistant: React.FC = () => {
  const [messageContent, setMessageContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [isEditReply, setIsEditReply] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { generateReply, reply, editReply } = useReplyStore();

  // async function refreshToken() {
  //   const clientId = import.meta.env.VITE_APP_OAUTH_CLIENT_ID;
  //   const clientSecret = import.meta.env.VITE_APP_OAUTH_CLIENT_SECRET;

  //   const response = await fetch("https://oauth2.googleapis.com/token", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({
  //       client_id: clientId,
  //       client_secret: clientSecret,
  //       refresh_token: userToken!,
  //       grant_type: "refresh_token",
  //     }),
  //   });

  //   if (!response.ok) {
  //     throw new Error("Failed to refresh token");
  //   }

  //   const data = await response.json();
  //   setUserToken(data.access_token);
  // }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Success:", tokenResponse);
      setUserToken(tokenResponse.access_token);
      setIsModalOpen(true);
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
    scope: "https://www.googleapis.com/auth/gmail.send",
  });

  useEffect(() => {
    if (userToken) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userToken}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [userToken]);

  // const fetchEmails = async () => {
  //   if (userToken) {
  //     const response = await fetch(
  //       "https://www.googleapis.com/gmail/v1/users/me/messages",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch emails");
  //     }

  //     const data = await response.json();
  //     console.log("Emails:", data);
  //   } else {
  //     alert("Please login first");
  //   }
  // };

  const handleGenerateReply = async () => {
    if (messageContent.trim()) {
      setIsLoading(true);
      await generateReply(messageContent);
      setIsLoading(false);
    } else {
      alert("Please enter the message content.");
    }
  };

  // Function to handle voice input start
  const startListening = () => {
    setListening(true);
    try {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        const voiceMessage = event.results[0][0].transcript;
        setMessageContent(voiceMessage);
        stopListening();
      };
      recognition.onspeechend = () => {
        recognition.stop();
      };
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        stopListening();
      };
      recognition.start();
    } catch (error) {
      console.error("Voice input error:", error);
      stopListening();
    }
  };

  // Function to stop voice input
  const stopListening = () => {
    setListening(false);
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported in this browser.");
    }
  };

  // const logOut = () => {
  //   googleLogout();
  //   setProfile(null);
  //   setUserToken(null);
  // };

  const handleSendEmail = async () => {
    if (!userToken) {
      login();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = async () => {
    setIsModalOpen(false);
    if (profile) {
      const email = [
        `From: ${profile.email}`,
        `To: ${profile.email}`,
        'Content-Type: text/plain; charset="UTF-8"',
        `Subject: AI-generated reply\r\n\r\n`,
        "",
        `This is the AI-generated reply: ${reply}`,
      ].join("\n");

      const base64EncodedEmail = btoa(email)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      try {
        const response = await fetch(
          "https://www.googleapis.com/gmail/v1/users/me/messages/send",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              raw: base64EncodedEmail,
            }),
          }
        );

        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to send email");
        }

        const data = await response.json();
        console.log("Email sent:", data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <div className="flex flex-col items-center justify-center w-full">
        <div className="header mb-4">
          <FaRobot size={48} className="text-gray-500 dark:text-gray-400" />
        </div>
        <div className="flex items-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-xl">
          <FaSearch className="text-gray-500 dark:text-gray-400 ml-2" />
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Enter text manually..."
            className="flex-grow p-2 ml-2 text-sm text-gray-700 dark:text-gray-200 bg-transparent border-none focus:ring-0 focus:outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500"
            rows={1}
          />
          <button
            onClick={handleGenerateReply}
            disabled={isLoading || listening}
            className="mr-2 p-2 bg-gray-500 text-white rounded-full shadow hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none"
          >
            <FaPaperPlane size={18} />
          </button>
          <button
            onClick={listening ? stopListening : startListening}
            disabled={isLoading}
            className="mr-2 p-2 bg-gray-500 text-white rounded-full shadow hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none"
          >
            {listening ? <FaStop size={18} /> : <FaMicrophone size={18} />}
          </button>
        </div>
        {reply && (
          <>
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow w-full max-w-xl">
              {isEditReply ? (
                <ReactQuill
                  value={reply}
                  onChange={editReply}
                  className="w-full p-2 text-base text-gray-700 dark:text-gray-200 rounded-lg dark:bg-gray-700 focus:ring-gray-500 focus:border-gray-500"
                  theme="snow"
                />
              ) : (
                <div
                  className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2"
                  dangerouslySetInnerHTML={{ __html: reply }}
                />
              )}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={() => {
                    navigator.clipboard.writeText(reply);
                    alert("Reply copied to clipboard");
                  }}
                >
                  <FaRegCopy size={18} />
                  <span>Copy</span>
                </button>
                <button
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={() => speakText(reply)}
                >
                  <FaVolumeUp size={18} />
                  <span>Read Aloud</span>
                </button>
                <button
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={handleSendEmail}
                >
                  <FaEnvelope size={18} />
                  <span>Send Email</span>
                </button>
                <button
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={handleGenerateReply}
                >
                  <FaSync size={18} />
                  <span>Regenerate</span>
                </button>
                {isEditReply ? (
                  <button
                    onClick={() => {
                      setIsEditReply(false);
                    }}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    <FaSave size={18} />
                    <span>Save</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    onClick={() => setIsEditReply(true)}
                  >
                    <FaEdit size={18} />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">
            Send Email
          </h2>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Recipient's email"
            className="w-full p-2 mb-4 text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-gray-500 focus:border-gray-500"
          />
          <ReactQuill
            value={reply}
            onChange={editReply}
            className="w-full p-2 mb-4 text-base text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
            theme="snow"
          />
          <button
            className="w-full p-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none"
            onClick={handleModalSubmit}
          >
            Send Email
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ReplyAssistant;
