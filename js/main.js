// Wait for the DOM to fully load before initializing scripts
document.addEventListener('DOMContentLoaded', () => {
	// ===== SPLIDE CAROUSEL INITIALIZATION =====
	if (window.Splide) {
		new Splide('#image-carousel', {
			type: 'loop',
			perPage: 3,
			autoplay: true,
			interval: 2000,
			pauseOnHover: true,
			arrows: true,
			pagination: true,
			breakpoints: {
				1224: { perPage: 2 },
				768: { perPage: 1 },
			},
		}).mount();
	}

	// ===== COUNTDOWN TIMER (HH:MM:SS) =====
	function startCountdown(duration) {
		let time = duration;
		const display = document.getElementById('timer');
		setInterval(() => {
			const minutes = String(Math.floor(time / 60)).padStart(2, '0');
			const seconds = String(time % 60).padStart(2, '0');
			display.textContent = `${minutes}:${seconds}`;
			if (--time < 0) time = duration; // restart after reaching 0
		}, 1000);
	}
	startCountdown(3600);

	// ===== MODAL LOGIC (MULTI-MODAL SUPPORT) =====
	const modal1 = document.getElementById('modal1');
	const modal2 = document.getElementById('modal2');

	document.getElementById('openModalBtn')?.addEventListener('click', () => {
		modal1.style.display = 'block';
	});

	document.getElementById('openModal2Btn')?.addEventListener('click', () => {
		modal1.style.display = 'none';
		modal2.style.display = 'block';
	});

	// Modal close buttons (with data-modal attribute)
	document.querySelectorAll('.close').forEach(btn => {
		btn.addEventListener('click', function () {
			const modalId = this.getAttribute('data-modal');
			document.getElementById(modalId).style.display = 'none';
		});
	});

	// ESC key closes all modals
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			[modal1, modal2].forEach(modal => modal && (modal.style.display = 'none'));
		}
	});

	// Click outside modal closes it
	window.addEventListener('click', e => {
		[modal1, modal2].forEach(modal => {
			if (e.target === modal) modal.style.display = 'none';
		});
	});

	// ===== RADIO BUTTON HIGHLIGHT LOGIC =====
	document.querySelectorAll('.radio-wrapper').forEach(wrapper => {
		wrapper.addEventListener('click', function () {
			document.querySelectorAll('.radio-wrapper').forEach(w => w.classList.remove('selected'));
			this.classList.add('selected');
			this.querySelector('input[type="radio"]').checked = true;
		});
	});
	// Initial highlight for checked radio
	document.querySelectorAll('.radio-wrapper input[type="radio"]').forEach(input => {
		if (input.checked) input.closest('.radio-wrapper').classList.add('selected');
	});

	// ===== COPY TO CLIPBOARD FUNCTIONALITY =====
	document.querySelector('.copy-btn')?.addEventListener('click', async function () {
		const cardText = document.getElementById('card-number')?.textContent.trim();
		if (!cardText) return;
		try {
			await navigator.clipboard.writeText(cardText);
			const original = this.innerHTML;
			// Optionally, show a visual cue for success
			setTimeout(() => {
				this.innerHTML = original;
			}, 1200);
		} catch (err) {
			alert('Nusxa olish muvaffaqiyatsiz bo‘ldi.');
		}
	});

	// ===== FILE UPLOAD (PDF, JPG, PNG ONLY) =====
	const uploadInput = document.getElementById('file-upload');
	const fileNameOutput = document.getElementById('upload-file-name');
	uploadInput?.addEventListener('change', () => {
		const file = uploadInput.files[0];
		if (file) {
			const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
			if (!allowed.includes(file.type)) {
				alert('Пожалуйста, загрузите файл в формате PDF, JPG или PNG.');
				uploadInput.value = '';
				fileNameOutput.textContent = '';
				return;
			}
			fileNameOutput.textContent = file.name;
		} else {
			fileNameOutput.textContent = '';
		}
	});

	// ===== FORM LOGIC =====
	const applicationForm = document.getElementById('applicationForm');
	const userNameInput = document.getElementById('userName');
	const userPhoneInput = document.getElementById('userPhone');
	const videoButton = applicationForm?.querySelector('.video-button');

	// Phone number format: XX XXX XX XX (Uzbek style)
	function formatPhoneNumber(value) {
		const digits = value.replace(/\D/g, '');
		if (digits.length <= 2) return digits;
		if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
		if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
		return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
	}
	userPhoneInput?.addEventListener('input', function (e) {
		const cursorPos = this.selectionStart;
		const oldVal = this.value;
		const newVal = formatPhoneNumber(oldVal);
		this.value = newVal;
		const newCursor = cursorPos + (newVal.length - oldVal.length);
		this.setSelectionRange(newCursor, newCursor);
	});

	// Remove error style on focus
	[userNameInput, userPhoneInput].forEach(input => {
		input?.addEventListener('focus', function () {
			this.style.borderColor = '#1e90ff';
		});
	});

	// Shake animation for invalid form
	const style = document.createElement('style');
	style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
	document.head.appendChild(style);

	// Inputs interactive effect
	document.querySelectorAll('.text-input').forEach(input => {
		input.addEventListener('focus', function () {
			this.parentElement.style.transform = 'translateY(-2px)';
			this.parentElement.style.transition = 'transform 0.3s ease';
		});
		input.addEventListener('blur', function () {
			this.parentElement.style.transform = 'translateY(0)';
		});
	});

	// Button hover effect
	videoButton?.addEventListener('mouseenter', function () {
		this.style.transform = 'translateY(-3px)';
	});
	videoButton?.addEventListener('mouseleave', function () {
		if (!this.disabled) this.style.transform = 'translateY(0)';
	});

	// Form validation
	function validateForm() {
		let isValid = true;
		userNameInput.style.borderColor = '#e8e8e8';
		userPhoneInput.style.borderColor = '#e8e8e8';

		if (userNameInput.value.trim().length < 2) {
			userNameInput.style.borderColor = '#ff4444';
			isValid = false;
		}
		const phoneDigits = userPhoneInput.value.replace(/\D/g, '');
		if (phoneDigits.length < 9) {
			userPhoneInput.style.borderColor = '#ff4444';
			isValid = false;
		}
		return isValid;
	}

	// Handle form submit
	applicationForm?.addEventListener('submit', function (e) {
		e.preventDefault();
		if (validateForm()) {
			// Show loading state on button
			const originalContent = videoButton.innerHTML;
			videoButton.innerHTML = '<span>Отправка...</span>';
			videoButton.disabled = true;
			videoButton.style.opacity = '0.7';

			setTimeout(() => {
				alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время для предоставления доступа к видео.');
				applicationForm.reset();
				videoButton.innerHTML = originalContent;
				videoButton.disabled = false;
				videoButton.style.opacity = '1';
			}, 2000);
		} else {
			applicationForm.style.animation = 'shake 0.5s ease-in-out';
			setTimeout(() => {
				applicationForm.style.animation = '';
			}, 500);
		}
	});

	// ===== OVERLAY LOGIC (CLOSE BUTTONS) =====
	document.querySelector('.close-btn')?.addEventListener('click', () => {
		document.querySelector('.overlay').style.display = 'none';
	});
	document.querySelector('.nazad-btn')?.addEventListener('click', () => {
		document.querySelector('.overlay').style.display = 'none';
	});

	// ===== CONGRATS MODAL LOGIC =====
	function closeCongratsModal() {
		document.querySelector('.congrats-modal').style.display = 'none';
		document.querySelector('.congrats-overlay').style.display = 'none';
	}
	document.querySelector('.congrats-close')?.addEventListener('click', closeCongratsModal);
	document.querySelector('.congrats-overlay')?.addEventListener('click', closeCongratsModal);
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') closeCongratsModal();
	});

	// // ===== MULTI-PAGE FORM HANDLING =====
	// // #mainForm can exist separately for another page navigation
	// document.getElementById('mainForm')?.addEventListener('submit', function (e) {
	// 	e.preventDefault();
	// 	const name = document.getElementById('userName')?.value || document.getElementById('name')?.value;
	// 	const phone = document.getElementById('userPhone')?.value || document.getElementById('phone')?.value;
	// 	window.location.href = `page2.html?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`;
	// });

	// URL dan query parametrlarga kirish
	const urlParams = new URLSearchParams(window.location.search);
	const name = urlParams.get('name');
	const phone = urlParams.get('phone');

	// Agar qiymatlar mavjud bo'lsa, inputlarga yozamiz
	if (name) document.getElementById('name').value = name;
	if (phone) document.getElementById('phone').value = phone;

	document.getElementById('mainForm')?.addEventListener('submit', function (e) {
		e.preventDefault();

		const formData = new FormData(this);
		const name = formData.get('userName');
		const phone = formData.get('userPhone');

		window.location.href = `page2.html?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`;
	});
});
