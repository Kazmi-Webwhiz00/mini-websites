function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function validateAndNextStep(currentStep, nextStep) {
    let isValid = true;
    document.querySelectorAll(`#step-${currentStep} [required]`).forEach(input => {
        if (!input.value) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    if (isValid) {
        document.getElementById(`step-${currentStep}`).style.display = 'none';
        document.getElementById(`step-${nextStep}`).style.display = 'block';
        updateProgress(nextStep);
    }
}

function prevStep(step) {
    document.querySelectorAll('.form-step').forEach(stepDiv => stepDiv.style.display = 'none');
    document.getElementById(`step-${step}`).style.display = 'block';
    updateProgress(step);
}

function updateProgress(step) {
    document.querySelectorAll('.steps-progress .step').forEach((stepDiv, index) => {
        stepDiv.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepDiv.classList.add('completed');
        } else if (index + 1 === step) {
            stepDiv.classList.add('active');
        }
    });
}
