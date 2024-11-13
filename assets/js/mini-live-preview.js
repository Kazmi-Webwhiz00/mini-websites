(function($) {
    
    // =============================
    // Background and Image Previews
    // =============================

    /**
     * Sets a background image preview on the specified element.
     * @param {string} previewSelector - Selector for the target element.
     * @param {string} previewUrl - URL of the image preview.
     * @param {string|null} overlaySelector - Selector for an optional overlay element to hide.
     */
    function setBackgroundImageLivePreview(previewSelector, previewUrl, overlaySelector = null) {
        if (!previewUrl) {
            console.error("No file selected");
            return;
        }

        $(previewSelector)
            .css('background-image', `url(${previewUrl})`)
            .show();

        // Hide overlay if specified
        if (overlaySelector) {
            $(overlaySelector).hide();
        }

        // Revoke URL after a short delay to release memory
        setTimeout(() => URL.revokeObjectURL(previewUrl), 100);
    }

    /**
     * Sets an image preview for a profile picture element.
     * @param {string} previewSelector - Selector for the <img> element where the preview will be displayed.
     * @param {string} previewUrl - URL of the image preview.
     * @param {object} options - Max width and height constraints for the preview.
     */
    function setLiveProfilePicturePreview(previewSelector, previewUrl, options = { maxWidth: '150px', maxHeight: '150px' }) {
        if (!previewUrl) {
            console.error("No file selected");
            return;
        }

        // Apply src, max dimensions, and show the preview
        $(previewSelector)
            .attr('src', previewUrl)
            .css({ 'max-width': options.maxWidth, 'max-height': options.maxHeight })
            .show();

        // Revoke URL after a short delay to release memory
        setTimeout(() => URL.revokeObjectURL(previewUrl), 100);
    }

    // ============================
    // Text Field Live Preview
    // ============================

    /**
     * Updates the text content of a specified target element.
     * @param {string} targetSelector - Selector for the element where text will be updated.
     * @param {string} value - The text to set as the content of the target element.
     */
    function updateLivePreviewTextFieldOnInput(targetSelector, value) {
        $(targetSelector).text(value);
    }

    // ============================
    // Exported Functions
    // ============================

    window.livePreview = {
        setBackgroundImageLivePreview,
        setLiveProfilePicturePreview,
        updateLivePreviewTextFieldOnInput
    };

})(jQuery);
