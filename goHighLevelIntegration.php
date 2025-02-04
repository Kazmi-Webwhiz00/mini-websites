<?php
// Define constants for GoHighLevel account/location ID and auth token.

/**
 * Create a contact in GoHighLevel.
 *
 * @param string $firstName The contact's first name.
 * @param string $lastName The contact's last name.
 * @param string $email The contact's email.
 * @param string $phone The contact's phone number.
 * @return bool True if the contact was successfully created, false otherwise.
 */
function create_gohighlevel_contact($firstName, $email, $phone, $companyName) {
    $location_id = get_option('gohighlevel_location_id', '01QE7eTxpcoIeOFTaYH4');
    $auth_token = get_option('gohighlevel_auth_token', 'pit-e449d572-5b5b-472a-80ce-0ef0a57205a8');
    $api_version = get_option('gohighlevel_api_version', '2021-07-28');

    // GoHighLevel API endpoint for creating a contact.
    $url = 'https://services.leadconnectorhq.com/contacts/';

    // Contact data payload.
    $body = [
        'firstName'   => $firstName,
        'email'       => $email,
        'companyName' => $companyName,
        'locationId'  => $location_id,
        'phone'       => $phone,
    ];

    // Headers for the API request.
    $headers = [
        'Authorization' => 'Bearer ' . $auth_token,
        'Version'       => $api_version,
        'Content-Type'  => 'application/json',
    ];

    // Try to create the contact up to 3 times.
    $attempts = 0;
    $max_attempts = 3;

    while ($attempts < $max_attempts) {
        $attempts++;

        // Make the API request using wp_remote_post.
        $response = wp_remote_post($url, [
            'headers' => $headers,
            'body'    => json_encode($body),
        ]);

        // Check if the request was successful.
        if (!is_wp_error($response)) {
            $status_code = wp_remote_retrieve_response_code($response);

            // If the response status is 200 or 201, the contact was successfully created.
            if ($status_code === 200 || $status_code === 201) {
                return true;
            }
        }

        // Log the error for debugging purposes (optional).
        $error_message = is_wp_error($response) ? $response->get_error_message() : wp_remote_retrieve_body($response);
        error_log('GoHighLevel contact creation failed: Attempt ' . $attempts . ' - ' . $error_message);
    }

    // If all attempts fail, return false.
    return false;
}
