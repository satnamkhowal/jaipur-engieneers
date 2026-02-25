document.addEventListener("DOMContentLoaded", function() {

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Adjust as needed, 0.1 means 10% of element visible
    });

    // Observe all elements with the class 'animate-on-scroll'
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

});


document.addEventListener("DOMContentLoaded", function() {

    // --- Scroll Animation Logic ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // --- Popup Form Logic ---
    const popup = document.getElementById('enquiry-popup');
    const openPopupButtons = document.querySelectorAll('.btn-enroll, .btn-enroll-course');
    const closePopupButton = document.getElementById('close-popup');
    
    const form = document.getElementById('enquiry-form');
    const submitButton = document.getElementById('submit-button');
    const successMessage = document.getElementById('success-message');

    // Function to open the popup
    const openPopup = () => {
        if (popup) {
            popup.classList.add('popup-visible');
        }
    };

    // Function to close the popup
    const closePopup = () => {
        if (popup) {
            popup.classList.remove('popup-visible');
            // Hide success message and reset form when closing
            successMessage.style.display = 'none';
            form.style.display = 'block';
            if(form) form.reset();
        }
    };

    // Add event listeners to all "Enroll Now" buttons
    openPopupButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openPopup();
        });
    });

    // Event listener for the close button
    if (closePopupButton) {
        closePopupButton.addEventListener('click', closePopup);
    }
    
    // Event listener to close popup when clicking on the overlay
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

    // --- Form Validation and Submission ---
    const validateForm = () => {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const location = document.getElementById('location');

        // Name Validation
        if (name.value.trim() === '') {
            document.getElementById('name-error').textContent = 'Name is required.';
            isValid = false;
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        // Phone Validation (simple 10-digit check for India)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            document.getElementById('phone-error').textContent = 'Please enter a valid 10-digit Indian mobile number.';
            isValid = false;
        }

        // Location Validation
        if (location.value.trim() === '') {
            document.getElementById('location-error').textContent = 'Location is required.';
            isValid = false;
        }

        return isValid;
    };

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm()) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';

                // --- Google Sheet Submission ---
                const scriptURL = 'https://script.google.com/macros/s/AKfycbzDn7jdIRveSKz-JJG5jdvWF8Abzmw7kBF2bq9XkRbVgxzkFbaf_NpZEf7jejxHCpCm/exec';
                const formData = new FormData(form);

                fetch(scriptURL, { method: 'POST', body: formData })
                    .then(response => {
                        if (response.ok) {
                            form.style.display = 'none';
                            successMessage.style.display = 'block';
                            setTimeout(closePopup, 3000); // Close popup after 3 seconds
                        } else {
                            throw new Error('Network response was not ok.');
                        }
                    })
                    .catch(error => {
                        console.error('Error!', error.message);
                        alert('An error occurred. Please try again.');
                    })
                    .finally(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Submit';
                    });
            }
        });
    }
});



// --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't already open, open it
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });