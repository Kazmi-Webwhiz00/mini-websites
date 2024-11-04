jQuery(document).ready(function($) {
   
    function previewImage(input, previewId) {
        getImagePreviewUrl(input).then(previewUrl => {
            $('#' + previewId).attr('src', previewUrl)
            .css({ width: '150px', height: '150px' })
            .show();
        }).catch(error => console.error(error));
    }

        // Function to generate a preview URL for a given file input
    function getImagePreviewUrl(input) {
        return new Promise((resolve, reject) => {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result); // Return the image URL
                };
                reader.onerror = function() {
                    reject("Failed to load image");
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                reject("No file selected");
            }
        });
    }
    // Form validation and navigation to the next step
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

        if (isValid) {
            $(`#kw-step-${currentStep}`).hide();
            $(`#kw-step-${nextStep}`).show();
            updateProgress(nextStep);
        }
    }

    // Navigation to the previous step
    function prevStep(step) {
        $('.form-step').hide();
        $(`#kw-step-${step}`).show();
        updateProgress(step);
    }

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

    function showLoader(message) {
        $('#kw-loader-message').text(message);
        $('#kw-loader-overlay').css('display', 'flex');
    }

        // Update loader message text in sequence
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

    // Bind event listeners for navigation and image preview
    function bindEventListeners() {
        $('#kw-main-image').on('change', function() {
            previewImage(this, 'kw-main-image-preview');
            previewImage(this, 'kw-mini-web-profile-pic img');
        });

        $('#kw-bg-image').on('change', function() {
            getImagePreviewUrl(this).then(previewUrl => {
                $('#kw-bg-image-preview').attr('src', previewUrl).show();
                $('#kw-mini-web-bg-image').css('background-image', `url(${previewUrl})`).show();
                $('.kw-bg-image-text').hide();
            }).catch(error => console.error(error));
        });

        $('[data-next]').on('click', function() {
            const currentStep = $(this).closest('.form-step').attr('id').split('-')[2];
            const nextStep = $(this).data('next');
            validateAndNextStep(currentStep, nextStep);
        });

        $('[data-prev]').on('click', function() {
            const prevStepNumber = $(this).data('prev');
            prevStep(prevStepNumber);
        });
    }

    // AJAX form submission
    function bindOnSubmit() {
        $('#kw-enhanced-form').on('submit', function(e) {
            e.preventDefault();
            showLoader('Initializing...');
            cycleLoaderMessages();

            const formData = new FormData(this);
            formData.append('action', 'submit_mini_website');
            formData.append('security', kw_mini_website_vars.nonce);

            $.ajax({
                url: kw_mini_website_vars.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        hideLoader();
                        window.location.href = response.data.post_url;
                    } else {
                        alert(response.data.message || 'Submission failed. Please try again.');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    hideLoader();
                    alert(`An error occurred: ${textStatus} - ${errorThrown}`);
                }
            });
        });
    }

    function updateUserNameDisplay() {
        $('#kw-name').on('input', function() {
            let userName = $(this).val();
            $('#kw-mini-web-user-name h2').text(userName);
        });
    }

    function updateCompanyName() {
        $('#kw-company-name').on('input', function() {
            // Get the current value of the input
            let companyName = $(this).val();
            // Update the h2 element within the kw-mini-web-company-name div
            $('#kw-mini-web-company-name h2').text(companyName);
        });
    }

    function updateJobeTitle() {
        $('#kw-job-title').on('input', function() {
            // Get the current value of the input
            let jobTitle = $(this).val();
            // Update the h2 element within the kw-mini-web-company-name div
            $('#kw-mini-web-job-title h2').text(jobTitle);
        });
    }

    function updateButtonsPreview() {
        $('#contact-button-label').on('input', function() {
            // Get the current value of the input
            let label = $(this).val();
            // Update the h2 element within the kw-mini-web-company-name div
            $('#kw-mini-web-contacts-btn .elementor-button-text').text(label);
        });

        $('#share-button-label').on('input', function() {
            // Get the current value of the input
            let label = $(this).val();
            // Update the h2 element within the kw-mini-web-company-name div
            $('#kw-mini-web-share-btn .elementor-button-text').text(label);
        });

        $('#website-button-label').on('input', function() {
            // Get the current value of the input
            let label = $(this).val();
            // Update the h2 element within the kw-mini-web-company-name div
            $('#kw-mini-web-website-btn .elementor-button-text').text(label);
        });
    }

    function bindPreviewEvents(){
        updateUserNameDisplay();
        updateCompanyName();
        updateJobeTitle();
        updateButtonsPreview();
    }
    // Initialize all event listeners and form handling
    function init() {
        bindEventListeners();
        bindOnSubmit();
        bindPreviewEvents();
    }

    // Start the form setup
    init();
});
