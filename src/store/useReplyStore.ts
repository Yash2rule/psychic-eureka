import create from 'zustand';

interface ReplyStore {
    reply: string;
    theme: 'light' | 'dark';
    generateReply: (messageText: string) => Promise<void>;
    editReply: (messageText: string) => void;
    setTheme: (theme: 'light' | 'dark') => void;

}

export const useReplyStore = create<ReplyStore>((set) => ({
    reply: '',
    theme: 'light',
    generateReply: async (messageText) => {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: messageText }),
          });
  
        const reply = await response.json();
        set({ reply: reply });
    },
    editReply: (reply) => {
        set({reply: reply})
    },
    setTheme: (theme) => set({ theme }),
}));
