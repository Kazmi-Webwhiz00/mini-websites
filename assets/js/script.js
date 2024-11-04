jQuery(document).ready(function($) {
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

    function validateAndNextStep(currentStep, nextStep) {
        let isValid = true;
        $('#kw-step-' + currentStep + ' [required]').each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        if (isValid) {
            $('#kw-step-' + currentStep).hide();
            $('#kw-step-' + nextStep).show();
            updateProgress(nextStep);
        }
    }

    function prevStep(step) {
        $('.form-step').hide();
        $('#kw-step-' + step).show();
        updateProgress(step);
    }

    function updateProgress(step) {
        $('.steps-progress .step').each(function(index) {
            $(this).removeClass('active completed');
            $(this).find('circle').removeClass('circle-active circle-completed circle-inactive');
            $(this).find('path').attr('stroke', 'grey');
    
            if (index + 1 < step) {
                $(this).addClass('completed');
                $(this).find('circle')
                    .addClass('circle-completed')
                    .attr('fill', '#28a745');
                $(this).find('path').attr('stroke', 'white');
            } else if (index + 1 === step) {
                $(this).addClass('active');
                $(this).find('circle').addClass('circle-active').attr('fill', 'none');
                $(this).find('path').attr('stroke', 'white');
            } else {
                $(this).find('circle').addClass('circle-inactive').attr('fill', 'none');
                $(this).find('path').attr('stroke', 'grey');
            }
        });
    }

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

    function bindOnSubmit(){
    // AJAX form submission
    $('#kw-enhanced-form').on('submit', function(e) {
        e.preventDefault();

        let formData = new FormData(this);
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
                    alert(response.data.message);
                }
            },
            error: function() {
                alert('An error occurred while submitting the form.');
            }
        });
    });
    }

    // Initialize event listeners
    bindOnSubmit();
    bindEventListeners();
});
