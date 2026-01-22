import { createContext } from "react";

type ChatDrawerContextType = {
    isOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    selectedId: string;
    setId: (id: string) => void;
};

export const ChatDrawerContext = createContext<ChatDrawerContextType | undefined>(undefined);

