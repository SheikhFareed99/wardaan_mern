// Utility functions for managing wishlist persistence

const WISHLIST_KEY = 'wardaan_wishlist';

export const saveWishlistToLocalStorage = (items) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving wishlist to localStorage:', err);
  }
};

export const getWishlistFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error retrieving wishlist from localStorage:', err);
    return [];
  }
};

export const clearWishlistFromLocalStorage = () => {
  try {
    localStorage.removeItem(WISHLIST_KEY);
  } catch (err) {
    console.error('Error clearing wishlist from localStorage:', err);
  }
};
