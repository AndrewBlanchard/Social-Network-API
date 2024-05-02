function formatDate(date) {
    // Ensure 'date' is a valid Date object
    if (!(date instanceof Date)) {
      throw new Error('Invalid date');
    }
  
    // Get individual date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Construct formatted date string
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }
  
  // Example usage:
  const now = new Date(); // Current date and time
  const formattedNow = formatDate(now);
  console.log(formattedNow); // Output: YYYY-MM-DD HH:MM:SS
  