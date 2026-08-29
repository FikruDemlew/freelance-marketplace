import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import {
    getConversations,
    createConversation,
    getMessages,
    sendMessage,
} from "../services/chat";


function Messages() {

    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    const applicationId = searchParams.get("application");

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    const [messageText, setMessageText] = useState("");

    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState(null);


    // Load conversations
    const loadConversations = async () => {

        try {

            const data = await getConversations();

            setConversations(data);

            return data;

        } catch (error) {

            console.error(error);

            setError("Failed to load conversations.");

            return [];

        }
    };


    // Open a conversation
    const openConversation = async (conversation) => {

        setSelectedConversation(conversation);

        setMessagesLoading(true);

        try {

            const data = await getMessages(conversation.id);

            setMessages(data);

        } catch (error) {

            console.error(error);

            setError("Failed to load messages.");

        } finally {

            setMessagesLoading(false);

        }
    };


    // Initial loading
    useEffect(() => {

        const initializeMessages = async () => {

            if (!user) {
                return;
            }

            setLoading(true);

            const data = await loadConversations();


            // If we came from an application
            if (applicationId) {

                const existingConversation = data.find(
                    (conversation) =>
                        Number(conversation.application) ===
                        Number(applicationId)
                );


                if (existingConversation) {

                    await openConversation(
                        existingConversation
                    );

                } else {

                    try {

                        const newConversation =
                            await createConversation(
                                applicationId
                            );

                        setConversations((previous) => [
                            newConversation,
                            ...previous,
                        ]);

                        await openConversation(
                            newConversation
                        );

                    } catch (error) {

                        console.error(error);

                        setError(
                            error.response?.data?.detail ||
                            "Unable to create conversation."
                        );

                    }

                }

            }

            setLoading(false);

        };


        initializeMessages();

    }, [user, applicationId]);


    // Send message
    const handleSendMessage = async (event) => {

        event.preventDefault();

        if (
            !messageText.trim() ||
            !selectedConversation ||
            sending
        ) {
            return;
        }


        setSending(true);

        try {

            const newMessage = await sendMessage(
                selectedConversation.id,
                messageText.trim()
            );


            setMessages((previous) => [
                ...previous,
                newMessage,
            ]);

            setMessageText("");


            // Refresh conversation list
            await loadConversations();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.detail ||
                "Failed to send message."
            );

        } finally {

            setSending(false);

        }

    };


    if (loading) {

        return (
            <div className="min-h-screen bg-gray-50">

                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center">

                    <p className="text-gray-500">
                        Loading messages...
                    </p>

                </div>

            </div>
        );

    }


    return (

        <div className="min-h-screen bg-gray-50">

            <Navbar />


            <main className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">

                <div className="mb-8">

                    <h1 className="text-4xl font-bold text-gray-950">
                        Messages
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Communicate with your clients and freelancers.
                    </p>

                </div>


                {error && (

                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                        {error}

                    </div>

                )}


                <div className="grid min-h-[600px] grid-cols-1 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm lg:grid-cols-3">


                    {/* Conversations */}

                    <aside className="border-b border-gray-200 lg:border-b-0 lg:border-r">

                        <div className="border-b border-gray-200 p-6">

                            <h2 className="font-bold text-gray-950">
                                Conversations
                            </h2>

                        </div>


                        {conversations.length === 0 ? (

                            <div className="p-6 text-center">

                                <p className="text-sm text-gray-500">
                                    No conversations yet.
                                </p>

                            </div>

                        ) : (

                            <div>

                                {conversations.map(
                                    (conversation) => {

                                        const otherUser =
                                            user?.id ===
                                            conversation.client
                                                ? conversation.freelancer_username
                                                : conversation.client_username;


                                        return (

                                            <button
                                                key={conversation.id}
                                                type="button"
                                                onClick={() =>
                                                    openConversation(
                                                        conversation
                                                    )
                                                }
                                                className={`w-full border-b border-gray-100 p-5 text-left transition hover:bg-gray-50 ${
                                                    selectedConversation?.id ===
                                                    conversation.id
                                                        ? "bg-gray-100"
                                                        : ""
                                                }`}
                                            >

                                                <p className="font-semibold text-gray-950">

                                                    {otherUser}

                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">

                                                    Conversation #
                                                    {conversation.id}

                                                </p>

                                            </button>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </aside>


                    {/* Chat */}

                    <section className="flex min-h-[600px] flex-col lg:col-span-2">


                        {!selectedConversation ? (

                            <div className="flex flex-1 items-center justify-center p-10 text-center">

                                <div>

                                    <div className="text-5xl">
                                        💬
                                    </div>

                                    <h2 className="mt-4 text-xl font-bold text-gray-950">

                                        Select a conversation

                                    </h2>

                                    <p className="mt-2 text-sm text-gray-500">

                                        Choose a conversation to start
                                        messaging.

                                    </p>

                                </div>

                            </div>

                        ) : (

                            <>

                                {/* Chat Header */}

                                <div className="border-b border-gray-200 p-6">

                                    <h2 className="font-bold text-gray-950">

                                        {user?.id ===
                                        selectedConversation.client
                                            ? selectedConversation.freelancer_username
                                            : selectedConversation.client_username}

                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400">

                                        Conversation #
                                        {selectedConversation.id}

                                    </p>

                                </div>


                                {/* Messages */}

                                <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-6">

                                    {messagesLoading ? (

                                        <div className="text-center">

                                            <p className="text-sm text-gray-500">
                                                Loading messages...
                                            </p>

                                        </div>

                                    ) : messages.length === 0 ? (

                                        <div className="flex h-full items-center justify-center text-center">

                                            <div>

                                                <p className="text-gray-500">
                                                    No messages yet.
                                                </p>

                                                <p className="mt-1 text-sm text-gray-400">
                                                    Send the first message.
                                                </p>

                                            </div>

                                        </div>

                                    ) : (

                                        messages.map((message) => {

                                            const isMine =
                                                Number(message.sender) ===
                                                Number(user?.id);


                                            return (

                                                <div
                                                    key={message.id}
                                                    className={`flex ${
                                                        isMine
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    }`}
                                                >

                                                    <div
                                                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                                            isMine
                                                                ? "bg-black text-white"
                                                                : "bg-white text-gray-900 border border-gray-200"
                                                        }`}
                                                    >

                                                        <p className="text-sm leading-6">
                                                            {message.content}
                                                        </p>

                                                        <p
                                                            className={`mt-1 text-[10px] ${
                                                                isMine
                                                                    ? "text-gray-400"
                                                                    : "text-gray-400"
                                                            }`}
                                                        >

                                                            {new Date(
                                                                message.created_at
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}

                                                        </p>

                                                    </div>

                                                </div>

                                            );

                                        })

                                    )}

                                </div>


                                {/* Send Message */}

                                <form
                                    onSubmit={handleSendMessage}
                                    className="border-t border-gray-200 bg-white p-5"
                                >

                                    <div className="flex gap-3">

                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(event) =>
                                                setMessageText(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Write a message..."
                                            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                        />

                                        <button
                                            type="submit"
                                            disabled={
                                                sending ||
                                                !messageText.trim()
                                            }
                                            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            {sending
                                                ? "Sending..."
                                                : "Send"}

                                        </button>

                                    </div>

                                </form>

                            </>

                        )}

                    </section>

                </div>

            </main>

        </div>

    );

}

export default Messages;