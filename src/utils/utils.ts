import Notiflix from 'notiflix';

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    Notiflix.Notify.success('Copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

export const formatDate = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  return date.toUTCString();
};
