import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
    const { conversationId } = useParams();
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
            if (!user) return;

            setLoading(true);
            const data = await loadConversations();

            if (conversationId) {
                const conversation = data.find(
                    (item) => Number(item.id) === Number(conversationId)
                );

                if (conversation) {
                    await openConversation(conversation);
                } else {
                    setError("Conversation not found.");
                }
            } else if (applicationId) {
                const existingConversation = data.find(
                    (conversation) =>
                        Number(conversation.application) ===
                        Number(applicationId)
                );

                if (existingConversation) {
                    await openConversation(existingConversation);
                } else {
                    try {
                        const newConversation = await createConversation(
                            applicationId
                        );

                        setConversations((previous) => [
                            newConversation,
                            ...previous,
                        ]);

                        await openConversation(newConversation);
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
    }, [user, applicationId, conversationId]);

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
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading messages…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text-main">
            <Navbar />

            <main className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">

                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Workspace</p>
                    <h1 className="mt-2 font-display text-3xl font-bold text-text-main sm:text-4xl">
                        Messages
                    </h1>
                    <p className="mt-1.5 text-sm text-text-muted">
                        Direct communication with your clients and freelancers.
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-3xl border border-border bg-surface shadow-xl lg:grid-cols-3">

                    {/* Conversations list sidebar */}
                    <aside className="border-b border-border lg:border-b-0 lg:border-r">

                        <div className="border-b border-border p-5">
                            <h2 className="font-display text-base font-bold text-text-main">
                                Conversations
                            </h2>
                        </div>

                        {conversations.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-text-muted">
                                    No conversations yet.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {conversations.map((conversation) => {
                                    const otherUser =
                                        user?.id === conversation.client
                                            ? conversation.freelancer_username
                                            : conversation.client_username;

                                    const isSelected = selectedConversation?.id === conversation.id;

                                    return (
                                        <button
                                            key={conversation.id}
                                            type="button"
                                            onClick={() => openConversation(conversation)}
                                            className={`flex w-full items-center gap-3.5 p-4 text-left transition-all duration-200 ${
                                                isSelected
                                                    ? "bg-primary/10 border-l-4 border-l-primary"
                                                    : "hover:bg-surface-hover"
                                            }`}
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary ring-1 ring-primary/25">
                                                {otherUser?.slice(0, 1).toUpperCase() || "U"}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-text-main"}`}>
                                                    {otherUser}
                                                </p>
                                                <p className="mt-0.5 text-xs text-text-muted">
                                                    Conversation #{conversation.id}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </aside>

                    {/* Chat view area */}
                    <section className="flex min-h-[600px] flex-col lg:col-span-2">

                        {!selectedConversation ? (
                            <div className="flex flex-1 items-center justify-center p-10 text-center">
                                <div>
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-hover text-3xl">
                                        💬
                                    </div>
                                    <h2 className="mt-4 font-display text-xl font-bold text-text-main">
                                        Select a conversation
                                    </h2>
                                    <p className="mt-2 text-sm text-text-muted">
                                        Choose a conversation from the left to view messages.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center gap-3 border-b border-border bg-surface-hover/50 p-4 sm:p-5">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-bold text-primary ring-1 ring-primary/25">
                                        {(user?.id === selectedConversation.client
                                            ? selectedConversation.freelancer_username
                                            : selectedConversation.client_username)?.slice(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="font-display text-base font-bold text-text-main">
                                            {user?.id === selectedConversation.client
                                                ? selectedConversation.freelancer_username
                                                : selectedConversation.client_username}
                                        </h2>
                                        <p className="text-xs text-text-muted">
                                            Conversation #{selectedConversation.id}
                                        </p>
                                    </div>
                                </div>

                                {/* Messages list */}
                                <div className="flex-1 space-y-4 overflow-y-auto bg-background/50 p-5 sm:p-6">
                                    {messagesLoading ? (
                                        <div className="flex h-full items-center justify-center">
                                            <div className="spinner" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex h-full items-center justify-center text-center">
                                            <div>
                                                <p className="text-sm font-semibold text-text-main">No messages yet</p>
                                                <p className="mt-1 text-xs text-text-muted">Send the first message below.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map((message) => {
                                            const isMine = Number(message.sender) === Number(user?.id);

                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                                            isMine
                                                                ? "bg-primary font-medium text-[#07130c] shadow-[0_0_12px_rgba(0,192,88,0.2)]"
                                                                : "bg-surface-hover text-text-main border border-border"
                                                        }`}
                                                    >
                                                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                                        <p className={`mt-1.5 text-[10px] text-right font-medium ${
                                                            isMine ? "text-[#07130c]/70" : "text-text-muted"
                                                        }`}>
                                                            {new Date(message.created_at).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Send Message Form */}
                                <form
                                    onSubmit={handleSendMessage}
                                    className="border-t border-border bg-surface p-4 sm:p-5"
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(event) => setMessageText(event.target.value)}
                                            placeholder="Write a message..."
                                            className="field flex-1"
                                        />

                                        <button
                                            type="submit"
                                            disabled={sending || !messageText.trim()}
                                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {sending ? "Sending..." : "Send"}
                                            <span>➤</span>
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