export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const checkClipboard = async (setNewUrl, setShowModal, setShowClipboardToast) => {
  try {
    const text = await navigator.clipboard.readText();
    if (isValidURL(text)) {
      setNewUrl(text);
      setShowModal(true);
      setShowClipboardToast(true);
      setTimeout(() => setShowClipboardToast(false), 3000);
    }
  } catch (error) {
    console.error('Error reading clipboard:', error);
  }
}; 