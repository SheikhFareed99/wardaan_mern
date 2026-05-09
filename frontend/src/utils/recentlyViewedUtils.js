const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_ITEMS = 8;

export const addToRecentlyViewed = (product) => {
  try {
    let recentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];

    recentlyViewed = recentlyViewed.filter((item) => item._id !== product._id);
    recentlyViewed.unshift(product);
    recentlyViewed = recentlyViewed.slice(0, MAX_ITEMS);

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  } catch (err) {
    console.error('Error saving recently viewed product:', err);
  }
};

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  } catch (err) {
    console.error('Error retrieving recently viewed products:', err);
    return [];
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (err) {
    console.error('Error clearing recently viewed products:', err);
  }
};
