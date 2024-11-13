(function($) {
    // ===============================
    // Step Validation and Navigation
    // ===============================

    // Validate fields and navigate to the next step
    function validateAndNextStep(currentStep, nextStep) {
        let isValid = true;
        const currentStepFields = $(`#kw-step-${currentStep} [required]`);

        currentStepFields.each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        // Additional validation for image inputs based on step
        const imageInput =  $(FORM_SELECTORS.PROFILE_IMAGE_INPUT);
        if (currentStep === '1' && imageInput.length && !imageInput[0].files.length) {
            alert("Image is required. Please upload an image to proceed.");
            isValid = false;
        }

        const bgImageInput = $(FORM_SELECTORS.BACKGROUND_IMAGE_INPUT);
        if (currentStep === '2' && bgImageInput.length && !bgImageInput[0].files.length) {
            alert("Image is required. Please upload an image to proceed.");
            isValid = false;
        }

        if (isValid) {
            $(`#kw-step-${currentStep}`).hide();
            $(`#kw-step-${nextStep}`).show();
            updateProgress(nextStep);
        }
    }

    // Navigate to the previous step
    function prevStep(step) {
        $('.form-step').hide();
        $(`#kw-step-${step}`).show();
        updateProgress(step);
    }

    // ===========================
    // Progress Bar Update
    // ===========================

    // Update the progress UI based on the current step
    function updateProgress(step) {
        $('.steps-progress .step').each(function(index) {
            const circle = $(this).find('circle');
            const path = $(this).find('path');
            $(this).removeClass('active completed');

            if (index + 1 < step) {
                $(this).addClass('completed');
                circle.addClass('circle-completed').attr('fill', '#28a745');
                path.attr('stroke', 'white');
            } else if (index + 1 === step) {
                $(this).addClass('active');
                circle.addClass('circle-active').attr('fill', 'none');
                path.attr('stroke', 'white');
            } else {
                circle.addClass('circle-inactive').attr('fill', 'none');
                path.attr('stroke', 'grey');
            }
        });
    }

    // ===============================
    // Loader Display and Messages
    // ===============================

    // Show the loader overlay with a message
    function showLoader(message) {
        $('#kw-loader-message').text(message);
        $('#kw-loader-overlay').css('display', 'flex');
    }

    // Cycle through loader messages
    function cycleLoaderMessages() {
        const messages = [
            'Uploading your details...',
            'Creating your mini website...',
            'Finalizing the setup...',
            'Almost there...'
        ];
        let messageIndex = 0;

        // Update message every 2 seconds
        const interval = setInterval(() => {
            if (messageIndex < messages.length) {
                $('#kw-loader-message').text(messages[messageIndex]);
                messageIndex++;
            } else {
                clearInterval(interval);
            }
        }, 2000); // 2-second interval between messages
    }

    // Hide the loader overlay
    function hideLoader() {
        $('#kw-loader-overlay').hide();
    }

    // ==========================
    // File Validation and Preview
    // ==========================

    // Validate file size for uploads
    function validateFileSize(input, maxSizeMB = 1) {
        const maxFileSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
        const file = input.files[0];

        if (file) {
            if (file.size > maxFileSize) {
                alert(`The file size exceeds the ${maxSizeMB} MB limit. Please upload a smaller file.`);
                return false;
            }
            return true; // File size is within the limit
        }
        return false;
    }

    // Preview image by setting it as the src for an element
    function previewImage(inputElement, previewSelector, options = { maxWidth: '150px', maxHeight: '150px' }) {
        return new Promise((resolve, reject) => {
            const file = inputElement.files[0];

            if (file) {
                const previewUrl = URL.createObjectURL(file);

                // Apply it as the src of an <img> element or other preview element
                $(previewSelector)
                    .attr('src', previewUrl)
                    .css({ 'max-width': options.maxWidth, 'max-height': options.maxHeight })
                    .show();

                // Resolve the Promise with the preview URL
                resolve(previewUrl);

                // Optionally revoke the object URL after a short delay to release memory
                setTimeout(() => URL.revokeObjectURL(previewUrl), 100);
            } else {
                reject("No file selected");
            }
        });
    }

    // ========================
    // Expose Utility Functions
    // ========================

    window.utils = {
        validateAndNextStep,
        prevStep,
        updateProgress,
        showLoader,
        cycleLoaderMessages,
        hideLoader,
        validateFileSize,
        previewImage
    };

})(jQuery);
