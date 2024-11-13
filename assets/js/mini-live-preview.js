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


    function updateGalleryImagesLivePreview(selectedFiles) {
        const gallery = document.getElementById('kw-user-gallary-preview');
        const images = gallery.querySelectorAll('img');
        const maxImages = 5;
    
        // Loop through images and update them with uploaded file URLs
        selectedFiles.slice(0, maxImages).forEach((fileObj, index) => {
            const previewUrl = URL.createObjectURL(fileObj.file);
            if (images[index]) {
                images[index].src = previewUrl;
                images[index].parentElement.parentElement.style.display = 'block'; // Show the figure container if hidden
            }
        });
    
        // Hide any extra images if fewer files are uploaded
        for (let i = selectedFiles.length; i < maxImages; i++) {
            if (images[i]) {
                images[i].parentElement.parentElement.style.display = 'none'; // Hide the figure container
            }
        }
    }
    // ============================
    // Exported Functions
    // ============================

    window.livePreview = {
        setBackgroundImageLivePreview,
        setLiveProfilePicturePreview,
        updateLivePreviewTextFieldOnInput,
        updateGalleryImagesLivePreview,
    };

})(jQuery);
