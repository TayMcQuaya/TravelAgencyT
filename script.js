// Smooth Scrolling for All Links with # href
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
    // Existing inquiry button functionality
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

    // Initialize booking system
    window.bookingSystem = new BookingSystem();
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

// Booking System Functionality
class BookingSystem {
    constructor() {
        this.currentService = null;
        this.bookings = this.loadBookings();
        this.initEventListeners();
        this.setMinDates();
    }

    // Initialize all event listeners
    initEventListeners() {
        // Book Now buttons
        document.querySelectorAll('.book-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const service = e.target.getAttribute('data-service');
                this.openBookingModal(service);
            });
        });

        // Modal close buttons
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeBookingModal();
        });

        document.querySelector('.cancel-button').addEventListener('click', () => {
            this.closeBookingModal();
        });

        // Confirmation modal close buttons
        document.querySelector('.close-confirmation').addEventListener('click', () => {
            this.closeConfirmationModal();
        });

        document.querySelector('.close-confirmation-button').addEventListener('click', () => {
            this.closeConfirmationModal();
        });

        // Notification modal close buttons
        document.querySelector('.close-notification').addEventListener('click', () => {
            this.closeNotificationModal();
        });

        document.querySelector('.close-notification-button').addEventListener('click', () => {
            this.closeNotificationModal();
        });

        // Booking confirmation
        document.querySelector('.confirm-booking-button').addEventListener('click', () => {
            this.confirmBooking();
        });

        // View bookings
        document.querySelector('.view-bookings-button').addEventListener('click', () => {
            this.closeConfirmationModal();
            this.showBookings();
        });

        document.getElementById('bookings-link').addEventListener('click', (e) => {
            e.preventDefault();
            // Scroll to services section instead of showing bookings
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Form field change listeners for price calculation
        this.setupFormListeners();
    }

    // Set minimum dates to today
    setMinDates() {
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(input => {
            input.min = today;
        });
    }

    // Setup form field listeners for real-time price calculation
    setupFormListeners() {
        const formFields = [
            'hotel-checkin', 'hotel-checkout', 'hotel-guests', 'hotel-type',
            'pickup-date', 'pickup-time', 'pickup-passengers', 'pickup-flight', 'pickup-destination',
            'rental-start', 'rental-end', 'bike-type', 'rental-insurance',
            'tour-date', 'tour-participants', 'tour-type', 'tour-duration'
        ];

        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('change', () => {
                    this.calculatePrice();
                });
                // Also listen for input events for real-time updates
                field.addEventListener('input', () => {
                    this.calculatePrice();
                });
            }
        });
    }

    // Open booking modal for specific service
    openBookingModal(service) {
        this.currentService = service;
        
        // Hide all forms
        document.querySelectorAll('.booking-form').forEach(form => {
            form.classList.add('hidden');
        });

        // Show specific form
        document.getElementById(`${service}-form`).classList.remove('hidden');

        // Update modal title
        const titles = {
            hotel: 'Book Hotel Accommodation',
            pickup: 'Book Airport Pickup',
            rental: 'Book Motorcycle Rental',
            tours: 'Book Custom Tour'
        };
        document.getElementById('modal-title').textContent = titles[service];

        // Show modal
        document.getElementById('booking-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Calculate initial price
        this.calculatePrice();
    }

    // Close booking modal
    closeBookingModal() {
        document.getElementById('booking-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    // Close confirmation modal
    closeConfirmationModal() {
        document.getElementById('confirmation-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Close notification modal
    closeNotificationModal() {
        document.getElementById('notification-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Show custom notification instead of alert
    showNotification(title, message, type = 'info') {
        document.getElementById('notification-title').textContent = title;
        document.getElementById('notification-text').textContent = message;
        
        const iconElement = document.getElementById('notification-icon');
        iconElement.className = `notification-icon ${type}`;
        
        // Set appropriate icon based on type
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        iconElement.textContent = icons[type] || icons.info;
        
        document.getElementById('notification-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Reset form fields
    resetForm() {
        document.querySelectorAll('.booking-form input, .booking-form select, .booking-form textarea').forEach(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = false;
            } else {
                field.value = '';
            }
        });
        document.querySelectorAll('.customer-info input, .customer-info textarea').forEach(field => {
            field.value = '';
        });
    }

    // Calculate price based on service and selections
    calculatePrice() {
        if (!this.currentService) return;

        let price = 0;
        let serviceDescription = '';
        let durationDescription = '';

        switch (this.currentService) {
            case 'hotel':
                price = this.calculateHotelPrice();
                break;
            case 'pickup':
                price = this.calculatePickupPrice();
                break;
            case 'rental':
                price = this.calculateRentalPrice();
                break;
            case 'tours':
                price = this.calculateTourPrice();
                break;
        }

        // Update price display
        document.getElementById('total-price').textContent = `$${price}`;
        
        // Update service and duration descriptions
        this.updatePriceBreakdown();
    }

    // Calculate hotel price
    calculateHotelPrice() {
        const checkin = document.getElementById('hotel-checkin').value;
        const checkout = document.getElementById('hotel-checkout').value;
        const type = document.getElementById('hotel-type').value;

        if (!checkin || !checkout) return 0;

        const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
        if (nights <= 0) return 0;

        const rates = {
            budget: 40,
            'mid-range': 75,
            luxury: 160
        };

        const price = nights * rates[type];
        
        // Update descriptions
        document.getElementById('service-description').textContent = 
            `${type.charAt(0).toUpperCase() + type.slice(1)} Hotel`;
        document.getElementById('duration-description').textContent = 
            `${nights} night${nights > 1 ? 's' : ''}`;

        return price;
    }

    // Calculate pickup price
    calculatePickupPrice() {
        const passengers = document.getElementById('pickup-passengers').value;
        const basePrice = 18;
        const extraPassengerPrice = 5;

        let price = basePrice;
        if (passengers === '5+') {
            price += extraPassengerPrice * 4; // Assuming 5+ means 6 passengers
        } else if (parseInt(passengers) > 1) {
            price += extraPassengerPrice * (parseInt(passengers) - 1);
        }

        // Update descriptions
        document.getElementById('service-description').textContent = 'Airport Pickup Service';
        document.getElementById('duration-description').textContent = 
            `${passengers} passenger${passengers !== '1' ? 's' : ''}`;

        return price;
    }

    // Calculate rental price
    calculateRentalPrice() {
        const startDate = document.getElementById('rental-start').value;
        const endDate = document.getElementById('rental-end').value;
        const bikeType = document.getElementById('bike-type').value;
        const insurance = document.getElementById('rental-insurance').value;

        if (!startDate || !endDate) return 0;

        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        if (days <= 0) return 0;

        const rates = {
            scooter: 5,
            standard: 6,
            premium: 8
        };

        let price = days * rates[bikeType];
        if (insurance === 'full') {
            price += days * 2;
        }

        // Update descriptions
        const bikeNames = {
            scooter: 'Scooter 125k RP',
            standard: 'Standard 150k RP',
            premium: 'Premium 250k RP'
        };
        document.getElementById('service-description').textContent = 
            `${bikeNames[bikeType]} + ${insurance === 'full' ? 'Full' : 'Basic'} Insurance`;
        document.getElementById('duration-description').textContent = 
            `${days} day${days > 1 ? 's' : ''}`;

        return price;
    }

    // Calculate tour price
    calculateTourPrice() {
        const participants = document.getElementById('tour-participants').value;
        const tourType = document.getElementById('tour-type').value;
        const duration = document.getElementById('tour-duration').value;

        const rates = {
            cultural: 35,
            nature: 45,
            adventure: 60,
            custom: 75
        };

        const multipliers = {
            half: 0.7,
            full: 1.0,
            multi: 2.5
        };

        let participantCount = participants === '5+' ? 6 : parseInt(participants);
        let price = participantCount * rates[tourType] * multipliers[duration];

        // Update descriptions
        const tourNames = {
            cultural: 'Cultural Tour',
            nature: 'Nature & Temples',
            adventure: 'Adventure Tour',
            custom: 'Custom Itinerary'
        };
        const durationNames = {
            half: 'Half Day',
            full: 'Full Day',
            multi: 'Multi-day'
        };
        document.getElementById('service-description').textContent = 
            `${tourNames[tourType]} (${durationNames[duration]})`;
        document.getElementById('duration-description').textContent = 
            `${participants} participant${participants !== '1' ? 's' : ''}`;

        return price;
    }

    // Update price breakdown display
    updatePriceBreakdown() {
        // This method ensures the breakdown is always current
        // Price calculation methods already update the descriptions
    }

    // Confirm booking
    confirmBooking() {
        if (!this.validateForm()) {
            this.showNotification('Incomplete Form', 'Please fill in all required fields before confirming your booking.', 'warning');
            return;
        }

        const booking = this.createBookingObject();
        this.saveBooking(booking);
        this.showConfirmation(booking);
        this.closeBookingModal();
    }

    // Validate form fields
    validateForm() {
        // Get the currently visible form and customer info
        const currentForm = document.getElementById(`${this.currentService}-form`);
        const customerInfo = document.querySelector('.customer-info');
        
        // Check current service form fields
        const serviceFields = currentForm.querySelectorAll('[required]');
        for (let field of serviceFields) {
            if (!field.value.trim()) {
                field.focus();
                field.style.borderColor = '#dc3545';
                setTimeout(() => {
                    field.style.borderColor = '#e9ecef';
                }, 3000);
                return false;
            }
        }
        
        // Check customer info fields
        const customerFields = customerInfo.querySelectorAll('[required]');
        for (let field of customerFields) {
            if (!field.value.trim()) {
                field.focus();
                field.style.borderColor = '#dc3545';
                setTimeout(() => {
                    field.style.borderColor = '#e9ecef';
                }, 3000);
                return false;
            }
        }
        
        return true;
    }

    // Create booking object
    createBookingObject() {
        const bookingId = 'BB' + Date.now().toString().slice(-8);
        const totalPrice = document.getElementById('total-price').textContent;
        const serviceDescription = document.getElementById('service-description').textContent;
        const durationDescription = document.getElementById('duration-description').textContent;

        return {
            id: bookingId,
            service: this.currentService,
            serviceDescription: serviceDescription,
            durationDescription: durationDescription,
            totalPrice: totalPrice,
            customerName: document.getElementById('customer-name').value,
            customerEmail: document.getElementById('customer-email').value,
            customerPhone: document.getElementById('customer-phone').value,
            specialRequests: document.getElementById('special-requests').value,
            bookingDate: new Date().toISOString(),
            status: 'Confirmed'
        };
    }

    // Save booking to localStorage
    saveBooking(booking) {
        this.bookings.push(booking);
        localStorage.setItem('baliBlissBookings', JSON.stringify(this.bookings));
    }

    // Load bookings from localStorage
    loadBookings() {
        const stored = localStorage.getItem('baliBlissBookings');
        return stored ? JSON.parse(stored) : [];
    }

    // Show confirmation modal
    showConfirmation(booking) {
        document.getElementById('booking-id').textContent = booking.id;
        document.getElementById('confirmed-service').textContent = booking.serviceDescription;
        document.getElementById('confirmed-price').textContent = booking.totalPrice;
        document.getElementById('confirmed-customer').textContent = booking.customerName;
        
        document.getElementById('confirmation-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Show bookings list with custom notification
    showBookings() {
        if (this.bookings.length === 0) {
            this.showNotification('No Bookings Found', 'You have no bookings yet. Book a service to see your booking history!', 'info');
            return;
        }

        let bookingsList = '';
        this.bookings.forEach((booking, index) => {
            bookingsList += `Booking ${index + 1}:\n`;
            bookingsList += `ID: ${booking.id}\n`;
            bookingsList += `Service: ${booking.serviceDescription}\n`;
            bookingsList += `Price: ${booking.totalPrice}\n`;
            bookingsList += `Date: ${new Date(booking.bookingDate).toLocaleDateString()}\n`;
            bookingsList += `Status: ${booking.status}\n\n`;
        });

        this.showNotification('Your Booking History', bookingsList, 'success');
    }
} 