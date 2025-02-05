const urlParams = new URLSearchParams(window.location.search);
const telegramUserId = urlParams.get('telegramUserId');

if (telegramUserId) {
  fetch('/api/register', { // Make sure the path is correct
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ telegramUserId }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Error registering user:', data.error);
      // Handle the error (e.g., display an error message on the page)
      const errorMessage = document.createElement('p');
      errorMessage.textContent = "Error: " + data.error;
      document.body.appendChild(errorMessage);

    } else {
      console.log('User registered:', data.message);
      // Proceed with your web app logic.  For now, just display a message:
      const successMessage = document.createElement('p');
      successMessage.textContent = "You're registered! Welcome to Treasure Planet!";
      document.body.appendChild(successMessage);
    }
  })
  .catch(error => {
    console.error("Error in fetch request:", error);
  });
} else {
  console.error("telegramUserId is missing from the URL.");
  const errorMessage = document.createElement('p');
  errorMessage.textContent = "Error: Telegram user ID is missing. Please return to Telegram and use the /start command.";
  document.body.appendChild(errorMessage);
}