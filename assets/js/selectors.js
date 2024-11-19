// selectors.js
// URL Regex
const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})(\/[^\s]*)?$/;

// Form Selectors
const FORM_SELECTORS = {
    FORM: '#kw-enhanced-form',
    NEXT_BUTTON: '[data-next]',
    PREV_BUTTON: '[data-prev]',
    ERROR_MESSAGE_CLOSE: '#kw-form-error-message-container .close',
    ERROR_MESSAGE_CONTAINER: '#kw-form-error-message-container',

    // Text Input Selectors
    NAME_INPUT: '#kw-name',
    EMAIL_INPUT: '#kw-email',
    COMPANY_NAME_INPUT: '#kw-company-name',
    JOB_TITLE_INPUT: '#kw-job-title',
    CONTACT_BUTTON_LABEL_INPUT: '#contact-button-label',
    SHARE_BUTTON_LABEL_INPUT: '#share-button-label',
    WEBSITE_BUTTON_LABEL_INPUT: '#website-button-label',
    FORM_USER_ABOUT_TITLE: '#kw-about-title',
    FORM_USER_ABOUT_TEXT: '#kw-about-text',

    // Image Input Selectors
    PROFILE_IMAGE_INPUT: '#kw-main-image',
    BACKGROUND_IMAGE_INPUT: '#kw-bg-image',

    GALLERY_INPUT: '#kw-user-gallery',
    GALLERY_UPLOAD: '#kw-user-gallery-upload',
    GALLERY_PREVIEWS: '#kw-user-gallery-previews',
    SELECTED_FILE_COUNT: '#selected-file-count',
    SHOW_SHARE_BUTTON_TOGGLE: '#is_show_share_button',
    SHOW_ADD_TO_CONTACT_BUTTON_TOGGLE: '#is_show_add_to_contact_button',
    SHOW_WEBSITE_BUTTON_TOGGLE: '#is_show_website_button',
    CONTAINER_SHARE_BUTTON:'#share-button-fields-wrapper',
    CONTAINER_ADD_TO_CONTACT_BUTTON: '#contact-button-fields-wrapper',
    BACKGROUND_IMAGE_OVERLAY_TEXT: '.kw-bg-image-text',

    /// ERROR divs
    USER_NAME_ERROR_DIV: '#kw-user-name-error',
    EMAIL_ERROR_DIV:'#kw-email-error',
    EMAIL_REGIX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    COMPANY_NAME_ERROR_DIV :'#kw-company-name-error',
    JOB_TITLE_ERROR_DIV: '#kw-designation-error',

    FB_URL_INPUT_SELECTOR:'#kw-fb-url' ,
    PHONE_NUMBER_INPUT_SELECTOR:'#kw-phone-number',
    LINKEDIN_URL_INPUT_SELECTOR: '#kw-linkedin-url',
    PHONE_NUMBER_ERROR_DIV: '#kw-phone-number-error',
    FB_URL_ERROR_DIV: '#kw-fb-url-error',
    LINKEDIN_URL_ERROR_DIV: '#kw-linkedin-url-error',
    URL_REGIX: urlRegex,
    PHONE_NUMBER_RIGIX: /^\d{7,15}$/,


    // New Error divs for Step 4
    ABOUT_TITLE_ERROR_DIV: '#kw-about-title-error',
    ABOUT_TEXT_ERROR_DIV: '#kw-about-text-error',

    // New Selectors for Website and Video URL
    WEBSITE_URL_INPUT_SELECTOR: '#user_website_url',
    VIDEO_URL_INPUT_SELECTOR: '#user_video_url',
    WEBSITE_URL_ERROR_DIV: '#user-website-url-error',
    VIDEO_URL_ERROR_DIV: '#user-video-url-error',


    DOMAIN_AVAILABLIT_CHECK_BUTTON: '#kw-mini-web-domain-availability-button',
    
};

// Preview Selectors
const PREVIEW_SELECTORS = {
    // Image Preview Selectors
    PROFILE_IMAGE_PREVIEW: '#kw-main-image-preview',
    PROFILE_PICTURE_LIVE_PREVIEW: '#kw-mini-web-profile-pic img',
    BACKGROUND_IMAGE_PREVIEW: '#kw-bg-image-preview',
    COVER_IMAGE_LIVE_PREVIEW: '#kw-mini-web-cover-image',

    // Live Preview Text Selectors
    LIVE_USER_NAME: '#kw-mini-web-user-name h3',
    LIVE_COMPANY_NAME: '#kw-mini-web-company-name h3',
    LIVE_JOB_TITLE: '#kw-mini-web-job-title h3',
    LIVE_CONTACT_BUTTON: '#kw-mini-web-contacts-btn .elementor-button-text',
    LIVE_SHARE_BUTTON: '#kw-mini-web-share-btn .elementor-button-text',
    LIVE_WEBSITE_BUTTON: '#kw-mini-web-website-btn .elementor-button-text',
    LIVE_CONTACT_BUTTON_CONTAINER:'#kw-mini-web-contacts-btn',
    LIVE_WEBSITE_BUTTON_CONTAINER:'#kw-mini-web-website-btn',
    LIVE_SHARE_BUTTON_CONTAINER:'#kw-mini-web-share-btn',
    LIVE_USER_ABOUT_TITLE:'#kw-mini-web-website-about-title h3',
    LIVE_USER_ABOUT_TEXT: '#kw-mini-web-website-about-text p',
};
