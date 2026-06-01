document.addEventListener('DOMContentLoaded', () => {
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    const donationForm = document.getElementById('donation-form');
    const impactText = document.getElementById('impact-text');
    
    // Impact descriptions for different amounts
    const impacts = {
        '10': 'provides a pack of native seeds for reforestation.',
        '25': 'covers school supplies and notebooks for one student.',
        '50': 'buys 5 primary medical consultation checkups.',
        '100': 'supports a child\'s schooling support programs for 6 months.',
        '250': 'sponsors a mobile tutoring camp day for a whole hamlet.'
    };
    
    function updateImpact(value) {
        if (!impactText) return;
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            impactText.textContent = 'Please choose or enter a donation amount.';
            return;
        }
        
        let foundImpact = 'helps us cover general operations and logistics.';
        // Match specific thresholds
        if (num >= 250) {
            foundImpact = impacts['250'];
        } else if (num >= 100) {
            foundImpact = impacts['100'];
        } else if (num >= 50) {
            foundImpact = impacts['50'];
        } else if (num >= 25) {
            foundImpact = impacts['25'];
        } else if (num >= 10) {
            foundImpact = impacts['10'];
        }
        
        impactText.innerHTML = `Your donation of <strong>$${num.toFixed(0)}</strong> ${foundImpact}`;
    }
    
    if (amountBtns.length > 0) {
        amountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Clear active states
                amountBtns.forEach(b => b.classList.remove('active'));
                if (customAmountInput) customAmountInput.value = '';
                
                btn.classList.add('active');
                const amt = btn.getAttribute('data-amount');
                updateImpact(amt);
            });
        });
    }
    
    if (customAmountInput) {
        customAmountInput.addEventListener('input', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            updateImpact(customAmountInput.value);
        });
    }
    
    // Read query parameter for initial cause selecting
    const urlParams = new URLSearchParams(window.location.search);
    const causeParam = urlParams.get('cause');
    if (causeParam) {
        const selectCause = document.getElementById('donation-cause');
        if (selectCause) {
            selectCause.value = causeParam;
        }
    }
    
    // Form Validation and Simulated success
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather inputs
            const name = document.getElementById('donor-name').value.trim();
            const email = document.getElementById('donor-email').value.trim();
            let selectedAmt = '';
            
            const activeBtn = document.querySelector('.amount-btn.active');
            if (activeBtn) {
                selectedAmt = activeBtn.getAttribute('data-amount');
            } else if (customAmountInput && customAmountInput.value) {
                selectedAmt = customAmountInput.value;
            }
            
            if (!selectedAmt || parseFloat(selectedAmt) <= 0) {
                alert('Please select or input a valid donation amount.');
                return;
            }
            
            if (!name || !email) {
                alert('Please fill out your name and email address.');
                return;
            }
            
            // Success overlay
            showSuccessModal(name, selectedAmt);
        });
    }
    
    function showSuccessModal(name, amount) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card text-center">
                <div class="modal-icon">&#10003;</div>
                <h2 style="color: var(--text-main); margin-bottom: var(--space-sm);">Thank You, ${name}!</h2>
                <p style="color: var(--text-muted); margin-bottom: var(--space-md);">We have successfully processed your simulation donation of <strong>$${parseFloat(amount).toFixed(2)}</strong>.</p>
                <p style="font-size: var(--text-sm); color: var(--text-light); margin-top: var(--space-sm);">A mock receipt has been sent to your email. Your support inspires us!</p>
                <button class="btn btn-primary" style="margin-top: var(--space-lg); width: 100%;" id="close-modal-btn">Return to Site</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add overlay styles dynamically if not loaded
        if (!document.getElementById('modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'modal-styles';
            styles.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(17, 24, 39, 0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(8px);
                }
                .modal-card {
                    background: white;
                    padding: var(--space-2xl);
                    border-radius: var(--radius-lg);
                    max-width: 480px;
                    width: 90%;
                    box-shadow: var(--shadow-xl);
                    transform: scale(0.9);
                    animation: modalFadeIn 0.3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes modalFadeIn {
                    to { transform: scale(1); }
                }
                .modal-icon {
                    width: 64px;
                    height: 64px;
                    background-color: var(--primary-light);
                    color: var(--primary);
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--text-3xl);
                    margin: 0 auto var(--space-lg);
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            modal.remove();
            if (donationForm) donationForm.reset();
            // Reset active button state
            amountBtns.forEach(b => b.classList.remove('active'));
            if (amountBtns[2]) {
                amountBtns[2].classList.add('active'); // set $50 default back
                updateImpact('50');
            }
        });
    }
    
    // Initial load preset selection setup
    if (amountBtns.length > 0) {
        amountBtns.forEach(b => b.classList.remove('active'));
        if (amountBtns[2]) {
            amountBtns[2].classList.add('active');
            updateImpact('50');
        }
    }
});
