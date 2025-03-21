/**
 * Main application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create model instance
    const model = new ClaroPaymentModel();
    
    // Create controller and initialize the app
    const controller = new ClaroPaymentController(model);
    controller.initialize();
    
    // For development/demo purposes - add mock image paths
    // No need to mock images as we have real ones now
});