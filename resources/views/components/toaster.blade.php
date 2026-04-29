@props(['position' => 'bottom-right'])

<div id="toaster" data-position="{{ $position }}"></div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const toaster = document.getElementById('toaster');
        if (toaster) {
            // The toaster will be rendered by React
        }
    });
</script>
