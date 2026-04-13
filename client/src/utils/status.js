export const getStatusObj = (lastActiveStr) => {
  if (!lastActiveStr) return { isOnline: false, text: 'Offline' };

  const lastActive = new Date(lastActiveStr).getTime();
  const now = Date.now();
  const diffMs = now - lastActive;

  // Strict 1-minute threshold
  if (diffMs < 60000 && diffMs >= 0) {
    return { isOnline: true, text: 'Online' };
  }

  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    return { isOnline: false, text: `Last seen ${diffMins} min ago` };
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    return { isOnline: false, text: `Last seen ${hours} hr ago` };
  } else {
    const days = Math.floor(diffMins / 1440);
    return { isOnline: false, text: `Last seen ${days} day${days > 1 ? 's' : ''} ago` };
  }
};
