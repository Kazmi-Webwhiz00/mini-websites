jQuery(document).ready(function($) {
    // Preview image function
    function previewImage(input, previewId) {
        const preview = $('#' + previewId);
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.attr('src', e.target.result).show();
            };
            reader.readAsDataURL(input.files[0]);
        }
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

    // Bind event listeners for navigation and image preview
    function bindEventListeners() {
        $('#kw-main-image').on('change', function() {
            previewImage(this, 'kw-main-image-preview');
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
                        alert(response.data.message);
                        window.location.href = response.data.post_url;
                    } else {
                        alert(response.data.message || 'Submission failed. Please try again.');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(`An error occurred: ${textStatus} - ${errorThrown}`);
                }
            });
        });
    }

    // Initialize all event listeners and form handling
    function init() {
        bindEventListeners();
        bindOnSubmit();
    }

    // Start the form setup
    init();
});
