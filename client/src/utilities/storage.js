export const storage = {
  getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  setItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
  clear() {
    localStorage.clear();
  },
};
