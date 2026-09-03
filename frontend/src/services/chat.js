import api from "../api/axios";


// Get all conversations for the logged-in user
export const getConversations = async () => {
    const response = await api.get("/chat/");
    return response.data;
};


// Create a conversation from an accepted application
export const createConversation = async (applicationId) => {
    const response = await api.post("/chat/", {
        application: applicationId,
    });

    return response.data;
};


// Get messages for a conversation
export const getMessages = async (conversationId) => {
    const response = await api.get(
        `/chat/${conversationId}/messages/`
    );

    return response.data;
};


// Send a message
export const sendMessage = async (conversationId, content) => {
    const response = await api.post(
        `/chat/${conversationId}/messages/`,
        {
            content,
        }
    );

    return response.data;
};