import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "@serenity_path_auth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: "apple" | "google" | "guest";
}

interface AuthState {
  user: AuthUser | null;
  isGuest: boolean;
  hasCompletedOnboarding: boolean;
}

const DEFAULT_STATE: AuthState = {
  user: null,
  isGuest: false,
  hasCompletedOnboarding: false,
};

interface AuthContextType {
  user: AuthUser | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithApple: () => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      if (stored) {
        setAuthState(JSON.parse(stored));
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuth = useCallback(async (state: AuthState) => {
    setAuthState(state);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(state));
  }, []);

  const signInWithApple = useCallback(async () => {
    if (Platform.OS !== "ios") return false;
    try {
      const AppleAuth = await import("expo-apple-authentication");
      const credential = await AppleAuth.signInAsync({
        requestedScopes: [
          AppleAuth.AppleAuthenticationScope.FULL_NAME,
          AppleAuth.AppleAuthenticationScope.EMAIL,
        ],
      });

      const name = credential.fullName
        ? `${credential.fullName.givenName || ""} ${credential.fullName.familyName || ""}`.trim()
        : "Apple User";

      const user: AuthUser = {
        id: credential.user,
        name: name || "Apple User",
        email: credential.email || "",
        provider: "apple",
      };

      await saveAuth({ user, isGuest: false, hasCompletedOnboarding: true });
      return true;
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") return false;
      return false;
    }
  }, [saveAuth]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const AuthSession = await import("expo-auth-session");
      const WebBrowser = await import("expo-web-browser");
      const Crypto = await import("expo-crypto");

      WebBrowser.maybeCompleteAuthSession();

      const nonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(),
      );

      const discovery = {
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenEndpoint: "https://oauth2.googleapis.com/token",
      };

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "serenitypath",
      });

      const request = new AuthSession.AuthRequest({
        clientId: "google-client-id-placeholder",
        scopes: ["openid", "profile", "email"],
        redirectUri,
        codeChallenge: nonce,
      });

      const result = await request.promptAsync(discovery);

      if (result.type === "success") {
        const user: AuthUser = {
          id: `google_${Date.now()}`,
          name: "Google User",
          email: "",
          provider: "google",
        };
        await saveAuth({ user, isGuest: false, hasCompletedOnboarding: true });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, [saveAuth]);

  const continueAsGuest = useCallback(async () => {
    await saveAuth({
      user: null,
      isGuest: true,
      hasCompletedOnboarding: true,
    });
  }, [saveAuth]);

  const logout = useCallback(async () => {
    await saveAuth(DEFAULT_STATE);
  }, [saveAuth]);

  const deleteAccount = useCallback(async () => {
    const keysToDelete = [
      AUTH_KEY,
      "@serenity_path_profile",
      "@serenity_path_journal_entries",
      "@serenity_path_bookmarks",
      "@serenity_path_checkins",
      "@serenity_path_gratitude",
      "@serenity_path_stepwork",
      "@serenity_path_notifications",
    ];
    await AsyncStorage.multiRemove(keysToDelete);
    setAuthState(DEFAULT_STATE);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isGuest: authState.isGuest,
        isAuthenticated: authState.hasCompletedOnboarding,
        isLoading,
        signInWithApple,
        signInWithGoogle,
        continueAsGuest,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
