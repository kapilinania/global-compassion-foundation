document.addEventListener('DOMContentLoaded', () => {
    // Step Elements
    const step1Section = document.getElementById('step-1-section');
    const step2Section = document.getElementById('step-2-section');
    const step3Section = document.getElementById('step-3-section');
    
    const step1Indicator = document.getElementById('step-1-indicator');
    const step2Indicator = document.getElementById('step-2-indicator');
    const step3Indicator = document.getElementById('step-3-indicator');

    // Step Navigation Buttons
    const nextBtns = document.querySelectorAll('.next-step-btn');
    const prevBtns = document.querySelectorAll('.prev-step-btn');

    // Amount Selection Elements
    const amountBtns = document.querySelectorAll('.amt-preset-btn');
    const customAmountInput = document.getElementById('custom-amount');
    const impactText = document.getElementById('impact-text');
    const donationCauseSelect = document.getElementById('donation-cause');
    const frequencyLabels = document.querySelectorAll('.freq-label');

    // Step 2 Information Inputs
    const donorNameInput = document.getElementById('donor-name');
    const donorEmailInput = document.getElementById('donor-email');
    const donorPhoneInput = document.getElementById('donor-phone');
    const whatsappOptin = document.getElementById('whatsapp-optin');
    const taxReceiptToggle = document.getElementById('tax-receipt-toggle');
    const panInputContainer = document.getElementById('pan-input-container');
    const donorPanInput = document.getElementById('donor-pan');

    // Step 3 Payment Selection Elements
    const payUpiCard = document.getElementById('pay-upi');
    const payOtherCard = document.getElementById('pay-other');
    const upiQrSection = document.getElementById('upi-qr-section');
    const cardFormSection = document.getElementById('card-form-section');
    const upiAmountDisplay = document.getElementById('upi-amount-display');
    const qrPlaceholder = document.getElementById('qr-code-placeholder');

    // Forms & Submit
    const donationForm = document.getElementById('donation-form');
    const submitBtn = document.getElementById('submit-donation-btn');

    // Internal State
    let currentStep = 1;
    let selectedAmount = 1000; // Default selection: ₹1000
    let frequency = 'One-Time';
    let paymentMethod = 'UPI'; // UPI or CARD

    // Indian Context Impact Descriptions
    const impacts = {
        '250': 'buys a set of local books and script workbooks for 1 child in Sajek Valley.',
        '500': 'provides 10 meters of high-density clean water pipeline for gravity networks.',
        '1000': 'covers basic diagnostic clinics and malaria screening kits for 5 patients.',
        '2000': 'sponsors local native script teacher training and materials for a month.',
        '5000': 'provides a complete water filter tank setup for an entire remote village.'
    };

    function updateImpact(value) {
        if (!impactText) return;
        const num = parseFloat(value);
        if (isNaN(num) || num < 10) {
            impactText.innerHTML = '<span style="color: var(--brand-accent); font-weight: 700;"><i class="fas fa-triangle-exclamation"></i> Minimum donation amount is ₹10.</span>';
            return;
        }

        let foundImpact = 'helps buy raw building tools, textbooks, and tree saplings for remote sectors.';
        // Match thresholds in INR
        if (num >= 5000) {
            foundImpact = impacts['5000'];
        } else if (num >= 2000) {
            foundImpact = impacts['2000'];
        } else if (num >= 1000) {
            foundImpact = impacts['1000'];
        } else if (num >= 500) {
            foundImpact = impacts['500'];
        } else if (num >= 250) {
            foundImpact = impacts['250'];
        }

        impactText.innerHTML = `Your donation of <strong>₹${num.toLocaleString('en-IN')}</strong> ${foundImpact}`;
    }

    // Set Initial Active Preset (₹1000)
    amountBtns.forEach(btn => {
        const amt = btn.getAttribute('data-amount');
        if (amt === '1000') {
            btn.classList.add('active');
            selectedAmount = 1000;
            updateImpact('1000');
        }
    });

    // Preset Button Click Event
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            if (customAmountInput) customAmountInput.value = '';
            
            btn.classList.add('active');
            selectedAmount = parseFloat(btn.getAttribute('data-amount'));
            updateImpact(selectedAmount);
        });
    });

    // Custom Amount Input Event
    if (customAmountInput) {
        customAmountInput.addEventListener('input', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            const val = customAmountInput.value.trim();
            if (val !== '') {
                selectedAmount = parseFloat(val);
                updateImpact(val);
            } else {
                selectedAmount = 0;
                updateImpact(0);
            }
        });
    }

    // Frequency Toggle Event
    frequencyLabels.forEach(label => {
        label.addEventListener('click', () => {
            frequencyLabels.forEach(l => l.classList.remove('active'));
            label.classList.add('active');
            const targetId = label.getAttribute('for');
            const radio = document.getElementById(targetId);
            if (radio) {
                radio.checked = true;
                frequency = (targetId === 'freq-one') ? 'One-Time' : 'Monthly';
            }
        });
    });

    // 80G Tax Exemption Toggle Event
    if (taxReceiptToggle) {
        taxReceiptToggle.addEventListener('change', () => {
            if (taxReceiptToggle.checked) {
                panInputContainer.style.display = 'block';
                donorPanInput.setAttribute('required', 'true');
            } else {
                panInputContainer.style.display = 'none';
                donorPanInput.removeAttribute('required');
                donorPanInput.value = '';
            }
        });
    }

    // Payment Selection Toggle Event
    if (payUpiCard && payOtherCard) {
        payUpiCard.addEventListener('click', () => {
            payUpiCard.classList.add('active');
            payUpiCard.style.border = '2px solid var(--secondary)';
            payUpiCard.style.background = 'var(--secondary-light)';
            payUpiCard.querySelector('.pay-check-circle').innerHTML = '<i class="fas fa-circle-check"></i>';
            payUpiCard.querySelector('.pay-check-circle').style.color = 'var(--secondary)';

            payOtherCard.classList.remove('active');
            payOtherCard.style.border = '1px solid var(--border-light)';
            payOtherCard.style.background = 'white';
            payOtherCard.querySelector('.pay-check-circle').innerHTML = '<i class="far fa-circle"></i>';
            payOtherCard.querySelector('.pay-check-circle').style.color = 'var(--border-light)';

            upiQrSection.style.display = 'block';
            cardFormSection.style.display = 'none';
            paymentMethod = 'UPI';
        });

        payOtherCard.addEventListener('click', () => {
            payOtherCard.classList.add('active');
            payOtherCard.style.border = '2px solid var(--secondary)';
            payOtherCard.style.background = 'var(--secondary-light)';
            payOtherCard.querySelector('.pay-check-circle').innerHTML = '<i class="fas fa-circle-check"></i>';
            payOtherCard.querySelector('.pay-check-circle').style.color = 'var(--secondary)';

            payUpiCard.classList.remove('active');
            payUpiCard.style.border = '1px solid var(--border-light)';
            payUpiCard.style.background = 'white';
            payUpiCard.querySelector('.pay-check-circle').innerHTML = '<i class="far fa-circle"></i>';
            payUpiCard.querySelector('.pay-check-circle').style.color = 'var(--border-light)';

            upiQrSection.style.display = 'none';
            cardFormSection.style.display = 'block';
            paymentMethod = 'CARD';
        });
    }

    // Step 1 Validation
    function validateStep1() {
        if (isNaN(selectedAmount) || selectedAmount < 10) {
            alert('Please select or input a valid donation amount (Minimum ₹10).');
            return false;
        }
        return true;
    }

    // Step 2 Validation
    function validateStep2() {
        const name = donorNameInput.value.trim();
        const email = donorEmailInput.value.trim();
        const phone = donorPhoneInput.value.trim();
        
        if (name.length < 3) {
            alert('Please enter your full name (at least 3 characters).');
            donorNameInput.focus();
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            donorEmailInput.focus();
            return false;
        }
        
        if (phone !== '') {
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid 10-digit Indian mobile number.');
                donorPhoneInput.focus();
                return false;
            }
        }

        if (taxReceiptToggle.checked) {
            const pan = donorPanInput.value.trim().toUpperCase();
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(pan)) {
                alert('Please enter a valid 10-character Indian PAN number (e.g. ABCDE1234F).');
                donorPanInput.focus();
                return false;
            }
        }

        return true;
    }

    // Generate Dynamic UPI QR Code using QR Server API
    function generateUpiQr() {
        if (!upiAmountDisplay || !qrPlaceholder) return;
        
        upiAmountDisplay.textContent = `₹${selectedAmount.toLocaleString('en-IN')}`;
        
        // Show loading spinner
        qrPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--secondary);"></i>';
        
        // Create full UPI Scheme URL
        // pa = merchant UPI address
        // pn = payee name
        // tn = transaction note
        // am = amount
        // cu = currency (INR)
        const upiScheme = `upi://pay?pa=president.gcf.024@okicici&pn=Global%20Compassion%20Foundation&tn=Donation%20to%20GCF&am=${selectedAmount}&cu=INR`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiScheme)}`;
        
        // Preload image
        const img = new Image();
        img.src = qrApiUrl;
        img.alt = `UPI QR Code for ₹${selectedAmount}`;
        img.style.width = '150px';
        img.style.height = '150px';
        img.style.display = 'block';
        img.onload = () => {
            qrPlaceholder.innerHTML = '';
            qrPlaceholder.appendChild(img);
        };
        img.onerror = () => {
            // fallback icon in case API fails
            qrPlaceholder.innerHTML = '<i class="fas fa-qrcode" style="font-size: 80px; color: var(--text-light);"></i><p style="font-size: 10px; margin-top: 4px;">Error loading QR. Pay to UPI ID below.</p>';
        };
    }

    // Step Transition Controls
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep === 1) {
                if (validateStep1()) {
                    currentStep = 2;
                    step1Section.style.display = 'none';
                    step2Section.style.display = 'block';
                    
                    step1Indicator.classList.remove('active');
                    step1Indicator.classList.add('completed');
                    step1Indicator.querySelector('span').innerHTML = '<i class="fas fa-check"></i>';
                    step2Indicator.classList.add('active');
                }
            } else if (currentStep === 2) {
                if (validateStep2()) {
                    currentStep = 3;
                    step2Section.style.display = 'none';
                    step3Section.style.display = 'block';
                    
                    step2Indicator.classList.remove('active');
                    step2Indicator.classList.add('completed');
                    step2Indicator.querySelector('span').innerHTML = '<i class="fas fa-check"></i>';
                    step3Indicator.classList.add('active');
                    
                    // Generate QR Code if UPI is selected
                    generateUpiQr();
                }
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep === 2) {
                currentStep = 1;
                step2Section.style.display = 'none';
                step1Section.style.display = 'block';
                
                step1Indicator.classList.remove('completed');
                step1Indicator.classList.add('active');
                step1Indicator.querySelector('span').textContent = '1';
                step2Indicator.classList.remove('active');
            } else if (currentStep === 3) {
                currentStep = 2;
                step3Section.style.display = 'none';
                step2Section.style.display = 'block';
                
                step2Indicator.classList.remove('completed');
                step2Indicator.classList.add('active');
                step2Indicator.querySelector('span').textContent = '2';
                step3Indicator.classList.remove('active');
            }
        });
    });

    // Read Cause parameter from Query String
    const urlParams = new URLSearchParams(window.location.search);
    const causeParam = urlParams.get('cause');
    if (causeParam && donationCauseSelect) {
        donationCauseSelect.value = causeParam;
    }

    // Submit Simulated Form
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (paymentMethod === 'CARD') {
                const cardNum = document.getElementById('card-num').value.trim();
                const cardExp = document.getElementById('card-exp').value.trim();
                const cardCvv = document.getElementById('card-cvv').value.trim();
                
                if (cardNum.length < 12) {
                    alert('Please enter a valid card number.');
                    return;
                }
                if (!/^\d{2}\/\d{2}$/.test(cardExp)) {
                    alert('Please enter a valid expiry date (MM/YY).');
                    return;
                }
                if (cardCvv.length < 3) {
                    alert('Please enter a valid CVV.');
                    return;
                }
            }

            // Processing state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing Payment...';
            
            setTimeout(() => {
                showSuccessModal();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Complete Donation';
            }, 1800);
        });
    }

    // Premium Success Modal with Mock PDF Receipt download
    function showSuccessModal() {
        const name = donorNameInput.value.trim();
        const email = donorEmailInput.value.trim();
        const phone = donorPhoneInput.value.trim() || 'Not Provided';
        const cause = donationCauseSelect.options[donationCauseSelect.selectedIndex].text;
        const panNumber = taxReceiptToggle.checked ? donorPanInput.value.trim().toUpperCase() : 'N/A';
        const isWhatsapp = whatsappOptin.checked && phone !== 'Not Provided';

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card text-center" style="max-width: 520px; padding: var(--space-xl); border-radius: var(--radius-lg); background: white; box-shadow: var(--shadow-xl);">
                <div class="modal-icon" style="width: 56px; height: 56px; border-radius: 50%; background: var(--secondary-light); color: var(--secondary); display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto var(--space-md);">&#10003;</div>
                
                <h2 style="font-family: var(--font-heading); color: var(--primary); font-size: var(--text-2xl); margin-bottom: var(--space-xs);">Dhanyavad, ${name}!</h2>
                <p style="color: var(--secondary); font-weight: 700; font-size: var(--text-sm); margin-bottom: var(--space-md);"><i class="fas fa-heart"></i> Thank you for your generous support!</p>
                
                <!-- Receipt detail summary -->
                <div style="background: var(--bg-offset); padding: var(--space-md); border-radius: var(--radius-md); text-align: left; margin-bottom: var(--space-lg); border: 1px solid var(--border-light); font-size: var(--text-xs); line-height: 1.6;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 4px; margin-bottom: var(--space-xs);">
                        <span style="color: var(--text-light);">Receipt No:</span>
                        <strong style="color: var(--primary);">GCF/2026-27/${Math.floor(100000 + Math.random() * 900000)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span style="color: var(--text-light);">Amount Paid:</span>
                        <strong style="color: var(--secondary);">₹${selectedAmount.toLocaleString('en-IN')} (${frequency})</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span style="color: var(--text-light);">Allocated Cause:</span>
                        <strong style="color: var(--primary); text-align: right; max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${cause}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span style="color: var(--text-light);">Tax Exemption (80G):</span>
                        <strong style="color: var(--primary);">${taxReceiptToggle.checked ? 'Eligible (50% Exemption)' : 'No'}</strong>
                    </div>
                    ${taxReceiptToggle.checked ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span style="color: var(--text-light);">PAN Number:</span>
                        <strong style="color: var(--primary);">${panNumber}</strong>
                    </div>` : ''}
                </div>
                
                <p style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-lg);">
                    ${taxReceiptToggle.checked ? 'An automated tax certificate' : 'A donation receipt'} has been sent to <strong>${email}</strong>${isWhatsapp ? ` and WhatsApp number <strong>${phone}</strong>` : ''}.
                </p>

                <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
                    <button class="btn btn-secondary" style="width: 100%; border-radius: var(--radius-full); color: white; display: flex; align-items: center; justify-content: center; gap: 8px;" id="download-receipt-btn">
                        <i class="fas fa-file-arrow-down"></i> Download 80G Receipt (PDF)
                    </button>
                    <button class="btn btn-outline" style="width: 100%; border-radius: var(--radius-full);" id="close-modal-btn">Return to Site</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Receipt Download Simulation
        document.getElementById('download-receipt-btn').addEventListener('click', () => {
            const receiptText = `
=========================================
      GLOBAL COMPASSION FOUNDATION
=========================================
Mizoram Charitable Trust Reg No: 824/2018
Tuichawng, Lunglei District, Mizoram, India
Contact: president.gcf.024@gmail.com
-----------------------------------------
DONATION RECEIPT & SEC 80G CERTIFICATE
-----------------------------------------
Receipt Number: GCF/2026-27/${Math.floor(100000 + Math.random() * 900000)}
Date: ${new Date().toLocaleDateString('en-IN')}
Donor Name: ${name}
Email Address: ${email}
Mobile Number: ${phone}
Donation Type: ${frequency}
PAN Card Number: ${panNumber}
-----------------------------------------
Donation Amount: INR ${selectedAmount.toLocaleString('en-IN')}
Amount in Words: Rupees ${numberToWords(selectedAmount)} Only
Cause: ${cause}
-----------------------------------------
This is a computer-generated receipt for a simulated
donation. No actual money was transferred. Global
Compassion Foundation claims 80G exemption benefits.
Thank you for your valuable support!
=========================================
            `;

            const blob = new Blob([receiptText], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `GCF_Donation_Receipt_${name.replace(/\s+/g, '_')}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('Mock receipt downloaded successfully as a text file!');
        });

        // Close Modal and Reset Form
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            modal.remove();
            resetDonationForm();
        });
    }

    function resetDonationForm() {
        if (donationForm) donationForm.reset();
        currentStep = 1;
        
        step1Section.style.display = 'block';
        step2Section.style.display = 'none';
        step3Section.style.display = 'none';

        step1Indicator.className = 'step-indicator active';
        step1Indicator.querySelector('span').textContent = '1';
        
        step2Indicator.className = 'step-indicator';
        step2Indicator.querySelector('span').textContent = '2';
        
        step3Indicator.className = 'step-indicator';
        step3Indicator.querySelector('span').textContent = '3';

        // Reset preset amount: ₹1000
        amountBtns.forEach(b => b.classList.remove('active'));
        amountBtns.forEach(btn => {
            if (btn.getAttribute('data-amount') === '1000') {
                btn.classList.add('active');
                selectedAmount = 1000;
                updateImpact('1000');
            }
        });
        
        if (customAmountInput) customAmountInput.value = '';
        if (taxReceiptToggle) taxReceiptToggle.checked = false;
        if (panInputContainer) panInputContainer.style.display = 'none';
        
        // Reset frequency
        frequency = 'One-Time';
        frequencyLabels.forEach(l => l.classList.remove('active'));
        if (frequencyLabels[0]) frequencyLabels[0].classList.add('active');
        
        // Reset payment selection
        if (payUpiCard) payUpiCard.click();
    }

    // Helper: Simple number to Indian words converter
    function numberToWords(num) {
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return ''; 
        let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
        return str.trim();
    }
});
