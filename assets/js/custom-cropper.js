jQuery(document).ready(function($) {
    var cropper;
    var $modal = $('#imageCropModal');
    var $cropperImage = $('#cropper-image');

    // Inputs
    var $inputProfile = $('#kw-main-image');
    var $inputCover = $('#kw-bg-image');

    // Previews
    var $previewProfile = $('#kw-main-image-preview');
    var $previewCover = $('#kw-bg-image-preview');

    // Variables to track which image is currently being edited
    var currentInput = null;
    var currentPreview = null;
    var currentImageType = null; // 'profile' or 'cover'

    // Common function to handle file input change
    function handleFileChange(input, preview, imageType) {
        var files = input[0].files;
        if (files && files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $cropperImage.attr('src', e.target.result);
                $modal.show();

                $cropperImage.off('load').on('load', function() {
                    if (cropper) {
                        cropper.destroy();
                    }

                    // Set aspect ratio depending on image type
                    var aspectRatio = 1; 
                    if (imageType === 'cover') {
                        // Example aspect ratio for cover image
                        aspectRatio = 700 / 275; 
                    }

                    cropper = new Cropper($cropperImage[0], {
                        aspectRatio: aspectRatio,
                        viewMode: 1,
                        zoomable: true,
                        scalable: true,
                        movable: true,
                        responsive: true
                    });
                });
            };
            reader.readAsDataURL(files[0]);

            // Set the current variables
            currentInput = input;
            currentPreview = preview;
            currentImageType = imageType;
        }
    }

    // Profile image change
    $inputProfile.on('change', function() {
        handleFileChange($inputProfile, $previewProfile, 'profile');
    });

    // Cover image change
    $inputCover.on('change', function() {
        handleFileChange($inputCover, $previewCover, 'cover');
    });

    // Close modal without saving
    $('.close-crop-modal').on('click', function() {
        $modal.hide();
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        if (currentInput) {
            // Reset the file input if canceled
            currentInput.val('');
        }
    });

    // Zoom In
    $('#zoom-in').on('click', function() {
        if (cropper) {
            cropper.zoom(0.1); // Zoom in by 10%
        }
    });

    // Zoom Out
    $('#zoom-out').on('click', function() {
        if (cropper) {
            cropper.zoom(-0.1); // Zoom out by 10%
        }
    });

    // Crop and save
    $('#crop-and-save').on('click', function() {
        if (!cropper) return;

        // Set desired dimensions
        var cropWidth = 300;
        var cropHeight = 300;
        if (currentImageType === 'cover') {
            // Adjust for a cover image (example: 16:9 ratio)
            cropWidth = 1200;
            cropHeight = 675;
        }

        var canvas = cropper.getCroppedCanvas({
            width: cropWidth,
            height: cropHeight
        });
        canvas.toBlob(function(blob) {
            var url = URL.createObjectURL(blob);
            // Set the local preview
            currentPreview.attr('src', url).show();
            $modal.hide();

            // Create a new file from the blob
            var file = new File([blob], 'cropped-image.png', {type: 'image/png'});
            var dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            currentInput[0].files = dataTransfer.files; // Update the file input with the cropped image

            // Update the live previews
            if (typeof livePreview !== 'undefined') {
                if (currentImageType === 'profile') {
                    livePreview.setLiveProfilePicturePreview(PREVIEW_SELECTORS.PROFILE_PICTURE_LIVE_PREVIEW, url, { maxWidth: '200px', maxHeight: '200px' });
                } else if (currentImageType === 'cover') {
                    livePreview.setBackgroundImageLivePreview(PREVIEW_SELECTORS.COVER_IMAGE_LIVE_PREVIEW, url, PREVIEW_SELECTORS.BACKGROUND_IMAGE_OVERLAY_TEXT);
                }
            }

            // Clean up cropper
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }

            // Reset current state
            currentInput = null;
            currentPreview = null;
            currentImageType = null;
        });
    });
});
