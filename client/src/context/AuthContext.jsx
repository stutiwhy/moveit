import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up
  const signUpNewUser = async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      if (error) {
        console.error("Sign-in error:", error.message);
        return { success: false, error: error.message };
      }

      console.log("Sign-in success:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during sign-in:", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  // Sign out
  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      return { success: false, error };
    }
    localStorage.removeItem("supabase.session");
    setSession(null);
    return { success: true };
  };

  useEffect(() => {
    // Try loading from localStorage
    const storedSession = localStorage.getItem("supabase.session");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
      setLoading(false);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
        if (session) {
          localStorage.setItem("supabase.session", JSON.stringify(session));
        }
      });
    }

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        localStorage.setItem("supabase.session", JSON.stringify(session));
      } else {
        localStorage.removeItem("supabase.session");
      }
    });

    // Return unsubscribe function
    return () => {
      listener.subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ signUpNewUser, signInUser, logoutUser, session }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
