(function($) {
    
    // Declare global variable
    var iframeDocument;

    // Wait for the iframe to load and then set the global variable
    $('#kw-mini-web-preview-iframe').on('load', function() {
        iframeDocument = $(this).contents();
    });

    // =============================
    // Background and Image Previews
    // =============================

    /**
     * Sets a background image preview on the specified element within the iframe.
     * @param {string} previewSelector - Selector for the target element within the iframe.
     * @param {string} previewUrl - URL of the image preview.
     * @param {string|null} overlaySelector - Selector for an optional overlay element to hide within the iframe.
     */
    function setBackgroundImageLivePreview(previewSelector, previewUrl, overlaySelector = null) {
        if (!previewUrl) {
            console.error("No file selected");
            return;
        }

        // Ensure iframeDocument is available before accessing it
        if (iframeDocument) {
            iframeDocument.find(previewSelector)
                .css('background-image', `url(${previewUrl})`)
                .show();

            // Hide overlay if specified
            if (overlaySelector) {
                iframeDocument.find(overlaySelector).hide();
            }
        } else {
            console.error("iframeDocument is not yet available.");
        }

        // Revoke URL after a short delay to release memory
        setTimeout(() => URL.revokeObjectURL(previewUrl), 100);
    }

    /**
     * Sets an image preview for a profile picture element within the iframe.
     * @param {string} previewSelector - Selector for the <img> element within the iframe.
     * @param {string} previewUrl - URL of the image preview.
     * @param {object} options - Max width and height constraints for the preview.
     */
    function setLiveProfilePicturePreview(previewSelector, previewUrl, options = { maxWidth: '150px', maxHeight: '150px' }) {
        if (!previewUrl) {
            console.error("No file selected");
            return;
        }

        // Ensure iframeDocument is available before accessing it
        if (iframeDocument) {
            iframeDocument.find(previewSelector)
                .attr('src', previewUrl)
                .attr('srcset', previewUrl)
                .css({ 'max-width': options.maxWidth, 'max-height': options.maxHeight })
                .show();
        } else {
            console.error("iframeDocument is not yet available.");
        }

        // Revoke URL after a short delay to release memory
        setTimeout(() => URL.revokeObjectURL(previewUrl), 100);
    }

    // ============================
    // Text Field Live Preview
    // ============================

    /**
     * Updates the text content of a specified target element within the iframe.
     * @param {string} targetSelector - Selector for the element within the iframe where text will be updated.
     * @param {string} value - The text to set as the content of the target element.
     */
    function updateLivePreviewTextFieldOnInput(targetSelector, value) {
        if (iframeDocument) {
            iframeDocument.find(targetSelector).text(value);
        } else {
            console.error("iframeDocument is not yet available.");
        }
    }

    /**
     * Updates the gallery images preview within the iframe.
     * @param {File[]} selectedFiles - List of selected files to display in the gallery.
     */
  

    function updateGalleryImagesLivePreview(selectedFiles) {
        if (!iframeDocument) {
            console.error("iframeDocument is not yet available.");
            return;
        }
    
        // Locate the gallery container within the iframe
        const gallery = iframeDocument.find('#kw-user-gallary-preview');
        console.log("Gallery container:", gallery);
    
        const galleryItems = gallery.find('.e-gallery-item'); // Select all gallery item <a> tags
        console.log("Gallery items found:", galleryItems.length);
    
        const maxImages = 5;
    
        // Loop through images and update them with uploaded file URLs
        selectedFiles.slice(0, maxImages).forEach((fileObj, index) => {
            const previewUrl = URL.createObjectURL(fileObj.file);
            console.log(`Processing file at index ${index} with preview URL:`, previewUrl);
    
            // Check if the gallery item exists
            if (galleryItems[index]) {
                const galleryItem = $(galleryItems[index]);
                console.log("Updating gallery item:", galleryItem);
    
                // Update the background image of the .e-gallery-image div inside each <a> tag
                const imageDiv = galleryItem.find('.e-gallery-image');
                if (imageDiv.length) {
                    console.log("Found .e-gallery-image div:", imageDiv);
                    imageDiv.css('background-image', `url(${previewUrl})`);
                } else {
                    console.warn(`No .e-gallery-image div found inside gallery item at index ${index}`);
                }
    
                // Set the href attribute of <a> tag to open the image in lightbox (if applicable)
                galleryItem.attr('href', previewUrl);
                console.log("Set href of gallery item to:", previewUrl);
    
                // Show the gallery item if hidden
                galleryItem.show();
            } else {
                console.warn(`No gallery item found at index ${index}`);
            }
        });
    
        // Hide any extra images if fewer files are uploaded
        for (let i = selectedFiles.length; i < maxImages; i++) {
            if (galleryItems[i]) {
                console.log(`Hiding extra gallery item at index ${i}`);
                $(galleryItems[i]).hide();
            }
        }
    }
    

    function toggleLivePreviewButtons(toggleSelector, inputSelector) {
        if (!iframeDocument) {
            console.error("iframeDocument is not yet available.");
            return;
        }
    
        const toggleCheckbox = $(toggleSelector);
        if (toggleCheckbox.is(':checked')) {
            iframeDocument.find(inputSelector).show();
        } else {
            iframeDocument.find(inputSelector).hide();
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
        toggleLivePreviewButtons
    };

})(jQuery);
