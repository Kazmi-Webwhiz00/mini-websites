jQuery(document).ready(function($) {
    var cropper;
    var $modal = $('#imageCropModal');
    var $cropperImage = $('#cropper-image');
    var $preview = $('#kw-main-image-preview');
    var $input = $('#kw-main-image');

    // After user selects an image
    $input.on('change', function(e) {
        var files = e.target.files;
        if (files && files.length > 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $cropperImage.attr('src', e.target.result);
                $modal.show();

                $cropperImage.off('load').on('load', function() {
                    if (cropper) {
                        cropper.destroy();
                    }
                    cropper = new Cropper($cropperImage[0], {
                        aspectRatio: 1,
                        viewMode: 1,
                        zoomable: true,
                        scalable: true,
                        movable: true,
                        responsive: true
                    });
                });
            };
            reader.readAsDataURL(files[0]);
        }
    });

    // Close modal without saving
    $('.close-crop-modal').on('click', function() {
        $modal.hide();
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        // Reset the file input if canceled
        $input.val('');
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

        var canvas = cropper.getCroppedCanvas({
            width: 300, // desired width
            height: 300 // desired height
        });
        canvas.toBlob(function(blob) {
            var url = URL.createObjectURL(blob);
            // Set the local preview
            $preview.attr('src', url).show();
            $modal.hide();

            // Create a new file from the blob
            var file = new File([blob], 'cropped-image.png', {type: 'image/png'});
            var dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            $input[0].files = dataTransfer.files; // Update the file input with the cropped image

            // Update the live preview inside the iframe
            // Assuming PREVIEW_SELECTORS.PROFILE_PICTURE_LIVE_PREVIEW and livePreview are available
            livePreview.setLiveProfilePicturePreview(PREVIEW_SELECTORS.PROFILE_PICTURE_LIVE_PREVIEW, url, { maxWidth: '200px', maxHeight: '200px' });

            // Clean up
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
        });
    });
});
