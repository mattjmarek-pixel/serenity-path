import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKMARKS_KEY = "@serenity_path_bookmarks";

export function useBookmarks() {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        setBookmarked(new Set(JSON.parse(stored)));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const toggleBookmark = useCallback(async (id: string) => {
    try {
      const newSet = new Set(bookmarked);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...newSet]));
      setBookmarked(newSet);
      return true;
    } catch (error) {
      return false;
    }
  }, [bookmarked]);

  const isBookmarked = useCallback((id: string) => {
    return bookmarked.has(id);
  }, [bookmarked]);

  return {
    bookmarked,
    isLoading,
    loadBookmarks,
    toggleBookmark,
    isBookmarked,
  };
}
