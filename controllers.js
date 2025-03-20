/**
 * Controller class for handling user interactions and view updates
 */
class ClaroPaymentController {
    constructor(model) {
        this.model = model;
        this.currentView = null;
        this.timerInterval = null;
        this.currentViewId = '';
    }
    
    /**
     * Initializes the application
     */
    initialize() {
        // Start with the first view
        this.loadView('view-001');
        
        // Preload images
        this.preloadImages();
    }
    
    /**
     * Preloads images for the application
     */
    preloadImages() {
        const images = [
            './img/character-blue.png',
            './img/character-female.png',
            './img/character-male.png',
            './img/success-character.png',
            './img/home.png',
            './img/dni.png',
            './img/receipt.png',
            './img/phone.png',
            './img/card.png',
            './img/other-payment.png',
            './img/sms.png',
            './img/email.png'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    /**
     * Loads a view template into the container
     * @param {string} viewId - Template ID for the view
     */
    loadView(viewId) {
        const viewContainer = document.getElementById('view-container');
        const template = document.getElementById(viewId);
        
        if (template && viewContainer) {
            // Clear existing view
            viewContainer.innerHTML = '';
            
            // Clone and append template content
            const content = template.content.cloneNode(true);
            viewContainer.appendChild(content);
            
            // Clear any existing timer
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            
            // Setup view specific handlers
            this.setupViewHandlers(viewId);
            this.currentViewId = viewId;
        }
    }
    
    /**
     * Sets up handlers specific to each view
     * @param {string} viewId - ID of the current view
     */
    setupViewHandlers(viewId) {
        switch (viewId) {
            case 'view-001':
                this.setupInputView();
                break;
            case 'view-002':
                this.setupBillsView();
                break;
            case 'view-003':
                this.setupPaymentMethodView();
                break;
            case 'view-004':
                this.setupReceiptsSelectionView();
                break;
            case 'view-005':
                this.setupSuccessView();
                break;
            case 'view-006':
                this.setupVoucherView();
                break;            
        }
        
        // Setup home icon on all views
        const homeIcon = document.querySelector('.home-icon');
        if (homeIcon) {
            homeIcon.addEventListener('click', () => {
                this.loadView('view-001');
                this.model.deselectAllReceipts();
            });
        }
    }
    
    /**
     * Sets up handlers for the input view
     */
    setupInputView() {
        const inputField = document.getElementById('input-field');
        const continueBtn = document.getElementById('continue-btn');
        
        if (inputField && continueBtn) {
            // Input validation
            inputField.addEventListener('input', () => {
                const isValid = this.model.validateInput(inputField.value);
                continueBtn.disabled = !isValid;
            });
            
            // Continue button handler
            continueBtn.addEventListener('click', () => {
                if (this.model.validateInput(inputField.value)) {
                    this.model.setInputValue(inputField.value);
                    this.loadView('view-002');
                }
            });
        }
    }
    
    /**
     * Sets up handlers for the bills view
     */
    setupBillsView() {
        const dniDisplay = document.getElementById('dni-display');
        const receiptsList = document.getElementById('receipts-container');
        const totalAmount = document.getElementById('total-amount');
        const receiptCount = document.getElementById('receipts-count');
        const paymentButton = document.getElementById('payment-btn');
        const timerSpan = document.getElementById('timer');
        
        // Display user input value
        if (dniDisplay) {
            dniDisplay.textContent = this.model.userData.inputValue;
        }
        
        // Populate receipts
        if (receiptsList) {
            receiptsList.innerHTML = '';
            this.model.receipts.forEach(receipt => {
                const item = document.createElement('div');
                item.className = 'receipt-item';
                item.setAttribute('data-id', receipt.id);
                
                item.innerHTML = `
                    <input type="checkbox" class="receipt-checkbox" ${receipt.selected ? 'checked' : ''}>
                    <div class="receipt-info">
                        <div>${receipt.id}</div>
                        <div>Mes: ${receipt.month}</div>
                    </div>
                    <div class="receipt-amount">S/${receipt.amount.toFixed(2)}</div>
                `;
                
                // Update UI state if already selected
                if (receipt.selected) {
                    item.classList.add('selected');
                }
                
                receiptsList.appendChild(item);
                
                // Add click handler for receipt selection
                const checkbox = item.querySelector('.receipt-checkbox');
                checkbox.addEventListener('change', () => {
                    const selected = this.model.toggleReceiptSelection(receipt.id);
                    item.classList.toggle('selected', selected);
                    
                    // Update totals
                    totalAmount.textContent = `S/${this.model.getTotalAmount().toFixed(2)}`;
                    receiptCount.textContent = this.model.userData.selectedReceipts.length;
                    
                    // Enable/disable payment button
                    paymentButton.disabled = this.model.userData.selectedReceipts.length === 0;
                });
            });
        }
        
        // Set up payment button
        if (paymentButton) {
            paymentButton.addEventListener('click', () => {
                if (this.model.userData.selectedReceipts.length > 0) {
                    this.loadView('view-003');
                }
            });
        }
        
        // Set up timer
        if (timerSpan) {
            let seconds = 8;
            timerSpan.textContent = seconds;
            
            this.timerInterval = setInterval(() => {
                seconds--;
                timerSpan.textContent = seconds;
                
                if (seconds <= 0) {
                    clearInterval(this.timerInterval);
                    this.loadView('view-004');
                }
            }, 1000);
        }
    }
    
    /**
     * Sets up handlers for the payment method view
     */
    setupPaymentMethodView() {
        const dniDisplay = document.getElementById('dni-display-payment');
        const receiptCount = document.getElementById('receipts-count-payment');
        const totalAmount = document.getElementById('total-amount-payment');
        const receiptInfo = document.getElementById('receipt-info');
        const receiptMonth = document.getElementById('receipt-month');
        const cardPayment = document.getElementById('card-payment');
        const otherPayment = document.getElementById('other-payment');
        
        // Display user input value
        if (dniDisplay) {
            dniDisplay.textContent = this.model.userData.inputValue;
        }
        
        // Display receipt count
        if (receiptCount) {
            receiptCount.textContent = this.model.userData.selectedReceipts.length;
        }
        
        // Display total amount
        if (totalAmount) {
            totalAmount.textContent = `S/${this.model.getTotalAmount().toFixed(2)}`;
        }
        
        // Display receipt info (using first selected receipt for demo)
        if (receiptInfo && receiptMonth && this.model.userData.selectedReceipts.length > 0) {
            const firstReceipt = this.model.userData.selectedReceipts[0];
            receiptInfo.textContent = firstReceipt.id;
            receiptMonth.textContent = `Mes: ${firstReceipt.month}`;
        }
        
        // Set up payment method selection
        if (cardPayment) {
            cardPayment.addEventListener('click', () => {
                this.model.generateOperationData('Tarjeta');
                this.model.generateVoucherData();
                this.loadView('view-006');
            });
        }
        
        if (otherPayment) {
            otherPayment.addEventListener('click', () => {
                this.model.generateOperationData('Otros medios');
                this.model.generateVoucherData();
                this.loadView('view-005');
            });
        }
    }
    setupVoucherView() {
        const dniDisplay = document.getElementById('dni-display-voucher');
        const receiptCount = document.getElementById('receipts-count-voucher');
        const totalAmount = document.getElementById('total-amount-voucher');
        const timerSpan = document.getElementById('timer-voucher');
        
        // Display user data
        if (dniDisplay) {
            dniDisplay.textContent = this.model.userData.inputValue;
        }
        
        if (receiptCount) {
            receiptCount.textContent = this.model.userData.selectedReceipts.length;
        }
        
        if (totalAmount) {
            totalAmount.textContent = `S/${this.model.getTotalAmount().toFixed(2)}`;
        }
        
        // Display voucher data
        document.getElementById('voucher-id').textContent = this.model.voucherData.id;
        document.getElementById('voucher-operation').textContent = this.model.voucherData.operation;
        document.getElementById('voucher-terminal').textContent = this.model.voucherData.terminal;
        document.getElementById('voucher-app').textContent = this.model.voucherData.app;
        document.getElementById('voucher-type').textContent = this.model.voucherData.type;
        document.getElementById('voucher-card').textContent = this.model.voucherData.card;
        document.getElementById('voucher-name').textContent = this.model.voucherData.name;
        document.getElementById('voucher-amount').textContent = this.model.getTotalAmount().toFixed(2);
        document.getElementById('voucher-aid').textContent = this.model.voucherData.aid;
        document.getElementById('voucher-app-label').textContent = this.model.voucherData.appLabel;
        document.getElementById('voucher-crypto').textContent = this.model.voucherData.crypto;
        
        // Set up timer
        if (timerSpan) {
            let seconds = 8;
            timerSpan.textContent = seconds;
            
            this.timerInterval = setInterval(() => {
                seconds--;
                timerSpan.textContent = seconds;
                
                if (seconds <= 0) {
                    clearInterval(this.timerInterval);
                    this.loadView('view-005');
                }
            }, 1000);
        }
    }

    
    /**
     * Sets up handlers for the receipts selection view
     */
    setupReceiptsSelectionView() {
        const dniDisplay = document.getElementById('dni-display-selection');
        const receiptsList = document.getElementById('receipts-selection-container');
        const totalAmount = document.getElementById('total-amount-selection');
        const receiptCount = document.getElementById('receipts-count-selection');
        const selectAllBtn = document.getElementById('select-all-btn');
        const timerSpan = document.getElementById('timer-selection');
        
        // Display user input value
        if (dniDisplay) {
            dniDisplay.textContent = this.model.userData.inputValue;
        }
        
        // Populate receipts
        if (receiptsList) {
            receiptsList.innerHTML = '';
            this.model.receipts.forEach(receipt => {
                const item = document.createElement('div');
                item.className = 'receipt-item';
                item.setAttribute('data-id', receipt.id);
                
                item.innerHTML = `
                    <input type="checkbox" class="receipt-checkbox" ${receipt.selected ? 'checked' : ''}>
                    <div class="receipt-info">
                        <div>${receipt.id}</div>
                        <div>Mes: ${receipt.month}</div>
                    </div>
                    <div class="receipt-amount">S/${receipt.amount.toFixed(2)}</div>
                `;
                
                // Update UI state if already selected
                if (receipt.selected) {
                    item.classList.add('selected');
                }
                
                receiptsList.appendChild(item);
                
                // Add click handler for receipt selection
                const checkbox = item.querySelector('.receipt-checkbox');
                checkbox.addEventListener('change', () => {
                    const selected = this.model.toggleReceiptSelection(receipt.id);
                    item.classList.toggle('selected', selected);
                    
                    // Update totals
                    totalAmount.textContent = `S/${this.model.getTotalAmount().toFixed(2)}`;
                    receiptCount.textContent = this.model.userData.selectedReceipts.length;
                });
            });
        }
        
        // Set up select all button
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                // Toggle select all based on current state
                if (this.model.userData.selectedReceipts.length < this.model.receipts.length) {
                    this.model.selectAllReceipts();
                    
                    // Update UI
                    document.querySelectorAll('.receipt-item').forEach(item => {
                        item.classList.add('selected');
                        const checkbox = item.querySelector('.receipt-checkbox');
                        if (checkbox) checkbox.checked = true;
                    });
                    
                    selectAllBtn.textContent = 'Deseleccionar todo';
                } else {
                    this.model.deselectAllReceipts();
                    
                    // Update UI
                    document.querySelectorAll('.receipt-item').forEach(item => {
                        item.classList.remove('selected');
                        const checkbox = item.querySelector('.receipt-checkbox');
                        if (checkbox) checkbox.checked = false;
                    });
                    
                    selectAllBtn.textContent = 'Seleccionar todo';
                }
                
                // Update totals
                totalAmount.textContent = `S/${this.model.getTotalAmount().toFixed(2)}`;
                receiptCount.textContent = this.model.userData.selectedReceipts.length;
            });
        }
        
        // Set up timer
        if (timerSpan) {
            let seconds = 2;
            timerSpan.textContent = seconds;
            
            this.timerInterval = setInterval(() => {
                seconds--;
                timerSpan.textContent = seconds;
                
                if (seconds <= 0) {
                    clearInterval(this.timerInterval);
                    this.loadView('view-002');
                }
            }, 1000);
        }
    }
    
    /**
     * Sets up handlers for the success view
     */
    setupSuccessView() {
        const operationId = document.getElementById('operation-id');
        const operationDate = document.getElementById('operation-date');
        const receiptId = document.getElementById('receipt-id');
        const paymentAmount = document.getElementById('payment-amount');
        const paymentMonth = document.getElementById('payment-month');
        const timerSpan = document.getElementById('timer-success');
        
        // Display operation details
        if (operationId) {
            operationId.textContent = this.model.operationData.operationId;
        }
        
        if (operationDate) {
            operationDate.textContent = this.model.operationData.operationDate;
        }
        
        // Display payment details (using first selected receipt for demo)
        if (receiptId && paymentAmount && paymentMonth && this.model.userData.selectedReceipts.length > 0) {
            const firstReceipt = this.model.userData.selectedReceipts[0];
            receiptId.textContent = firstReceipt.id;
            paymentAmount.textContent = `S/${firstReceipt.amount.toFixed(2)}`;
            paymentMonth.textContent = firstReceipt.month;
        }
        
        // Set up timer
        if (timerSpan) {
            let seconds = 6;
            timerSpan.textContent = seconds;
            
            this.timerInterval = setInterval(() => {
                seconds--;
                timerSpan.textContent = seconds;
                
                if (seconds <= 0) {
                    clearInterval(this.timerInterval);
                    this.loadView('view-001');
                    this.model.deselectAllReceipts();
                }
            }, 1000);
        }
    }
}
