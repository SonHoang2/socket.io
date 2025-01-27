import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { SERVER_URL } from "../config/config";

const socket = io(SERVER_URL);

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Listen for incoming messages
        socket.on("receiveMessage", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const messageData = {
                id: Date.now(),
                text: message,
                time: new Date().toLocaleTimeString(),
            };
            socket.emit("sendMessage", messageData); // Send the message to the server
            setMessages(prevMessages => [...prevMessages, messageData]);
            setMessage("");
        }
    };

    return (
        <div className="py-4 flex bg-neutral-100 h-full">
            <div className="rounded mx-4">
                <div className="rounded-lg p-3 flex align-middle bg-neutral-200">
                    <span className="material-symbols-outlined">chat_bubble</span>
                </div>
            </div>
            <div className="rounded-lg p-3 bg-white me-4 w-1/5">
                <h1 className="text-2xl font-bold">Chats</h1>
            </div>
            <div className="rounded-lg p-3 bg-white w-4/5 me-4">
                <div className="flex justify-between">
                    <div className="flex">
                        <div>
                            <img className="inline-block size-10 rounded-full ring-2 ring-white" src="/img/user-avatar-default.jpg" alt="" />
                        </div>
                        <div className="flex flex-col ms-2">
                            <span className="text-base font-bold">John Doe</span>
                            <span className="text-sm text-gray-500">Active now</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="material-symbols-outlined text-blue-500">more_horiz</span>
                    </div>
                </div>

                <div className="">
                    {messages.map((msg) => (
                        <div key={msg.id} className="text-3xl">
                            <span>{msg.text}</span>
                            <small>{msg.time}</small>
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
