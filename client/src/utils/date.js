/**
 * Formats a date string into "DD MMM, H AM/PM"
 * Example: "2026-08-25T17:00:00.000Z" -> "25 Aug, 5 PM"
 */
export const formatSessionDate = (dateString) => {
  if (!dateString) return 'Not Scheduled';
  
  const date = new Date(dateString);
  
  // Format: "25 Aug"
  const dayMonth = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });
  
  // Format: "5 PM"
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const time = `${hours} ${ampm}`;
  
  return `${dayMonth}, ${time}`;
};
