const urlParams = new URLSearchParams(window.location.search);
const telegramUserId = urlParams.get('telegramUserId');

if (telegramUserId) {
  // *** IMPORTANT: Replace with your ACTUAL backend URL ***
  const backendUrl = 'https://78.47.217.78:3000'; // Or your domain name and port

  fetch(`${backendUrl}/api/register`, {
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
      const errorMessage = document.createElement('p');
      errorMessage.textContent = "Error: " + data.error;
      document.body.appendChild(errorMessage);
    } else {
      console.log('User registered:', data.message);
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