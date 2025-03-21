/**
 * Model class for managing the application data
 */
class ClaroPaymentModel {
    constructor() {
        // App data
        this.userData = {
            inputValue: '',
            inputType: '',  // dni, code, phone
            selectedReceipts: []
        };
        
        // Mock data - receipts
        this.receipts = [
            {
                id: 'REC SB02-0205244456',
                month: '2025',
                amount: 34.95,
                selected: false
            },
            {
                id: 'REC SB02-0176299774',
                month: '2024',
                amount: 20.89,
                selected: false
            },
            {
                id: 'REC SB02-0205244123',
                month: '2025',
                amount: 42.66,
                selected: false
            }
        ];
        
        // Operation data
        this.operationData = {
            operationId: '',
            operationDate: '',
            operationType: 'Pago de servicios',
            paymentMethod: ''
        };
    }
    
    /**
     * Validates user input
     * @param {string} input - User input string
     * @returns {boolean} - True if valid, false otherwise
     */
    validateInput(input) {
        // Accept any alphanumeric input up to 14 characters
        return /^[a-zA-Z0-9]{1,14}$/.test(input);
    }
    
    /**
     * Sets the user input value
     * @param {string} input - User input string
     */
    setInputValue(input) {
        this.userData.inputValue = input;
        
        // Determine input type based on format
        if (/^\d{8}$/.test(input)) {
            this.userData.inputType = 'dni';
        } else if (/^\d{10,}$/.test(input)) {
            this.userData.inputType = 'phone';
        } else {
            this.userData.inputType = 'code';
        }
    }
    
    /**
     * Toggles receipt selection
     * @param {string} receiptId - ID of the receipt
     * @returns {boolean} - New selection state
     */
    toggleReceiptSelection(receiptId) {
        const receipt = this.receipts.find(r => r.id === receiptId);
        if (receipt) {
            receipt.selected = !receipt.selected;
            
            // Update selected receipts list
            if (receipt.selected) {
                this.userData.selectedReceipts.push(receipt);
            } else {
                this.userData.selectedReceipts = this.userData.selectedReceipts.filter(r => r.id !== receiptId);
            }
            
            return receipt.selected;
        }
        return false;
    }
    
    /**
     * Selects all receipts
     */
    selectAllReceipts() {
        this.receipts.forEach(receipt => {
            receipt.selected = true;
        });
        this.userData.selectedReceipts = [...this.receipts];
    }
    
    /**
     * Deselects all receipts
     */
    deselectAllReceipts() {
        this.receipts.forEach(receipt => {
            receipt.selected = false;
        });
        this.userData.selectedReceipts = [];
    }
    
    /**
     * Gets the total amount to pay
     * @returns {number} - Total amount
     */
    getTotalAmount() {
        return this.userData.selectedReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    }
    
    /**
     * Generates operation data for successful payment
     * @param {string} paymentMethod - Selected payment method
     */
    generateOperationData(paymentMethod) {
        this.operationData.operationId = Math.floor(Math.random() * 9000000000) + 1000000000;
        
        const now = new Date();
        const date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        this.operationData.operationDate = `${date} ${time}`;
        
        this.operationData.paymentMethod = paymentMethod;
    }
}