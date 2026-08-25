import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommunityType } from "@/constants/theme";

const COMMUNITY_KEY = "@serenity_path_community";

export type CommunityPath = "AA" | "NA" | "Both";

interface CommunityState {
  path: CommunityPath | null;
  activeView: CommunityType;
}

const DEFAULT_STATE: CommunityState = {
  path: null,
  activeView: "AA",
};

interface CommunityContextType {
  path: CommunityPath | null;
  activeView: CommunityType;
  activeCommunity: CommunityType;
  isLoaded: boolean;
  setPath: (path: CommunityPath) => Promise<void>;
  setActiveView: (view: CommunityType) => Promise<void>;
  toggleActiveView: () => Promise<void>;
  resetPath: () => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CommunityState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(COMMUNITY_KEY)
      .then((stored) => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as Partial<CommunityState>;
            const validPath: CommunityPath | null =
              parsed.path === "AA" ||
              parsed.path === "NA" ||
              parsed.path === "Both"
                ? parsed.path
                : null;
            setState({
              path: validPath,
              activeView: parsed.activeView === "NA" ? "NA" : "AA",
            });
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setIsLoaded(true));
  }, []);

  const persist = useCallback(async (next: CommunityState) => {
    setState(next);
    try {
      await AsyncStorage.setItem(COMMUNITY_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const setPath = useCallback(
    async (path: CommunityPath) => {
      const activeView: CommunityType =
        path === "NA" ? "NA" : path === "AA" ? "AA" : state.activeView;
      await persist({ path, activeView });
    },
    [persist, state.activeView],
  );

  const setActiveView = useCallback(
    async (view: CommunityType) => {
      await persist({ ...state, activeView: view });
    },
    [persist, state],
  );

  const toggleActiveView = useCallback(async () => {
    const next: CommunityType = state.activeView === "AA" ? "NA" : "AA";
    await persist({ ...state, activeView: next });
  }, [persist, state]);

  const resetPath = useCallback(async () => {
    await persist({ path: null, activeView: "AA" });
  }, [persist]);

  // For pure AA or NA paths, activeCommunity is the path itself.
  // For "Both", it follows the user's toggle (activeView).
  const activeCommunity: CommunityType =
    state.path === "AA" ? "AA" : state.path === "NA" ? "NA" : state.activeView;

  return (
    <CommunityContext.Provider
      value={{
        path: state.path,
        activeView: state.activeView,
        activeCommunity,
        isLoaded,
        setPath,
        setActiveView,
        toggleActiveView,
        resetPath,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return ctx;
}
