// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor click behavior

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth', // Enable smooth scrolling
                block: 'start' // Scroll to the top of the target element
            });
        }
    });
});

// Auto-check service checkboxes when "Inquire Now" is clicked
document.addEventListener('DOMContentLoaded', function() {
    const inquireButtons = document.querySelectorAll('.details-button');
    
    inquireButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            
            // Get the service name from the card
            const card = this.closest('.package-card');
            const serviceTitle = card.querySelector('.card-front h3').textContent.trim();
            
            // Map service titles to checkbox IDs
            const serviceMap = {
                'Hotel Booking': 'hotel-booking',
                'Airport Pickup': 'airport-pickup',
                'Motorcycle Rental': 'motorcycle-rental',
                'Custom Tours': 'custom-tours'
            };
            
            // Find and check the corresponding checkbox
            const checkboxId = serviceMap[serviceTitle];
            if (checkboxId) {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
            
            // Scroll to the contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Contact Form Handling - Show Success Message
const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');

if (contactForm && successMessage) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        // Get form data for logging (optional)
        const name = this.elements['name'].value;
        const email = this.elements['_replyto'].value;
        const message = this.elements['message'].value;
        
        // Get selected services
        const selectedServices = [];
        const serviceCheckboxes = this.querySelectorAll('input[name="services"]:checked');
        serviceCheckboxes.forEach(checkbox => {
            selectedServices.push(checkbox.value);
        });

        // Log the form data (you can remove this if not needed)
        console.log('Form Submitted:');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);
        console.log('Selected Services:', selectedServices);

        // Hide the form and show the success message
        contactForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        // Scroll to the success message
        successMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });
}

// Placeholder for Mobile Menu Toggle Functionality
// function toggleMobileMenu() {
//     const navUl = document.querySelector('nav ul');
//     navUl.classList.toggle('active');
// }

// You would need to add a menu button (hamburger icon) to your HTML
// and then add an event listener to it, like so:
// const menuToggle = document.querySelector('.menu-toggle'); // Assuming you add a class 'menu-toggle' to your button
// if (menuToggle) {
//     menuToggle.addEventListener('click', toggleMobileMenu);
// }

console.log("JavaScript file loaded and running."); 