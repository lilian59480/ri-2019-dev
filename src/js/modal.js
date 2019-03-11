/// @ts-check

/**
 * Open modal
 * @param {HTMLElement} modal
 * @param {HTMLHtmlElement} html
 */
const openModal = (modal, html) => {
	modal.classList.add("is-active");
	html.classList.add("is-clipped");
};

/**
 * Close modal
 * @param {HTMLElement} modal
 * @param {HTMLHtmlElement} html
 */
const closeModal = (modal, html) => {
	modal.classList.remove("is-active");
	html.classList.remove("is-clipped");
};

window.addEventListener('load', () => {
	const modalToggles = document.getElementsByClassName("modal-toggle");
	const htmls = document.getElementsByTagName("html");

	if (htmls.length != 1) {
		console.error("[IG2I-modal] Multiple or no html tag!");
		return;
	}

	const htmlNode = htmls[0];

	Array.from(modalToggles).forEach((/** @type {HTMLElement} */ buttonElement) => {
		const modalId = buttonElement.dataset.id;
		if (!modalId) {
			return;
		}

		const modal = document.getElementById(modalId);
		console.log(modal);
		if (!modal) {
			return;
		}

		buttonElement.addEventListener('click', () => {
			openModal(modal, htmlNode);
		});
	});

	console.log("[IG2I-modal] Enabled %s modal opener buttons", modalToggles.length);
});

window.addEventListener('load', () => {
	const modalClose = document.getElementsByClassName("modal-close");
	const htmls = document.getElementsByTagName("html");

	if (htmls.length != 1) {
		console.error("[IG2I-modal] Multiple or no html tag!");
		return;
	}

	const htmlNode = htmls[0];

	Array.from(modalClose).forEach((/** @type {HTMLElement} */ buttonElement) => {
		/**
		 * @type {HTMLElement}
		 */
		let modal;
		let prevElement = buttonElement;

		while (!modal) {
			const modalTmp = prevElement.parentElement;
			if (modalTmp.classList.contains("modal")) {
				modal = modalTmp;
			} else if (modalTmp == htmlNode) {
				modal = htmlNode;
			} else {
				prevElement = prevElement.parentElement;
			}
		}

		if (modal == htmlNode) {
			return;
		}

		buttonElement.addEventListener('click', () => {
			closeModal(modal, htmlNode);
		});
	});

	console.log("[IG2I-modal] Enabled %s modal close buttons", modalClose.length);
});
