/// @ts-check

const priceFormatter = Intl.NumberFormat(
	[
		"FR-fr",
		"fr"
	],
	{
		style: "currency",
		currency: "EUR",
		currencyDisplay: "symbol"
	}
);

/**
 * Recalculate prices
 * @param {HTMLInputElement[]} inputList 
 * @param {HTMLElement} priceElement 
 * @param {HTMLElement} partenaireElement 
 */
const recalculateEstimatedPrice = (inputList, priceElement, partenaireElement) => {
	const multiplier = 2.5;
	const estimatedPrice = inputList.map((element) => {
		if (!element.dataset.price) {
			return 0;
		}
		try {
			const basePrice = parseInt(element.dataset.price, 10);

			if (element.type === "range") {
				return basePrice * parseInt(element.value, 10);
			}

			if (element.type === "radio") {
				if (element.checked) {
					return basePrice;
				}
				return 0;
			}

			return basePrice;

		} catch (error) {
			return 0;
		}
	}).reduce((prev, next) => {
		return prev + next;
	});

	const partenaireEstimatedPrice = estimatedPrice;
	const standardEstimatedPrice = estimatedPrice * multiplier;

	const partenaireDisplayedPrice = priceFormatter.format(
		partenaireEstimatedPrice / 100
	);

	const standardDisplayedPrice = priceFormatter.format(
		standardEstimatedPrice / 100
	);

	partenaireElement.textContent = partenaireDisplayedPrice;
	priceElement.textContent = standardDisplayedPrice;
};

/**
 * Use fetch to submit data
 * @param {HTMLFormElement} form
 */
const formUseFetch = (form) => {
	return fetch(
		form.getAttribute('action'),
		{
			method: 'POST',
			body: new FormData(form)
		}
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network error");
			}
			return response.json()
		})
		.then((json) => {
			if (json.error) {
				throw new Error("Error while processing your request :" + json.data.message);
			}
			return json;
		})
};

/**
 * Change active form control
 * @param {HTMLElement} activeElement
 * @param {HTMLElement} toggledElement
 */
const toggleControl = (activeElement, toggledElement) => {

	activeElement.classList.remove('is-active');
	toggledElement.classList.add('is-active');

	activeElement.classList.add('is-hidden');
	toggledElement.classList.remove('is-hidden');
};

/**
 * Change active buttons
 * @param {number} activeElementIndex
 * @param {number} length
 * @param {HTMLElement} nextButton
 * @param {HTMLElement} previousButton
 * @param {HTMLElement} submitButton
 */
const toggleActionButton = (
	activeElementIndex,
	length,
	nextButton,
	previousButton,
	submitButton
) => {

	if (activeElementIndex === 0) {
		previousButton.classList.add('is-hidden');
	} else {
		previousButton.classList.remove('is-hidden');
	}

	if (activeElementIndex === length - 1) {
		nextButton.classList.add('is-hidden');
		submitButton.classList.remove('is-hidden');
	} else {
		nextButton.classList.remove('is-hidden');
		submitButton.classList.add('is-hidden');
	}
};

// Change form to use fetch
window.addEventListener('load', () => {

	const nextButton = /** @type {HTMLButtonElement} */ (
		document.getElementById("price-next")
	);
	const previousButton = /** @type {HTMLButtonElement} */ (
		document.getElementById("price-previous")
	);
	const submitButton = /** @type {HTMLButtonElement} */ (
		document.getElementById("price-submit")
	);

	const notificationSuccess = document.getElementById("price-success");
	const notificationError = document.getElementById("price-error");

	const form = /** @type {HTMLFormElement} */ (document.forms['prices']);
	form.addEventListener('submit', (e) => {
		e.preventDefault();

		notificationSuccess.classList.add("is-hidden");
		notificationError.classList.add("is-hidden");

		if (form.checkValidity()) {
			nextButton.disabled = true;
			previousButton.disabled = true;
			submitButton.disabled = true;
			submitButton.classList.add("is-loading");
			formUseFetch(form)
				.then(() => {
					notificationSuccess.classList.remove("is-hidden");
				})
				.catch((error) => {
					console.error(error);
					notificationError.classList.remove("is-hidden");
					const errorBlock = notificationError.getElementsByTagName("pre")[0];
					errorBlock.textContent = error.message;
				})
				.finally(() => {
					nextButton.disabled = false;
					previousButton.disabled = false;
					submitButton.disabled = false;
					submitButton.classList.remove("is-loading");
				});
		}
	});

	console.log("[IG2I-prices] Form override enabled");

});

// Add form control
window.addEventListener('load', () => {

	const htmlForm = document.getElementById("prices-form");
	const controlList = Array.from(
		htmlForm.getElementsByClassName("formcontrol")
	);

	const nextButton = document.getElementById("price-next");
	const previousButton = document.getElementById("price-previous");
	const submitButton = document.getElementById("price-submit");

	/**
	 * Change buttons
	 * @param {number} limitValue
	 * @param {number} next
	 */
	const changeButton = (limitValue, next) => {
		const activeElementIndex = controlList.findIndex((element) => {
			return element.classList.contains("is-active");
		});

		if (
			(activeElementIndex === limitValue) ||
			(activeElementIndex === -1)
		) {
			return;
		}

		const activeElement = /** @type {HTMLFormElement} */ (
			controlList[activeElementIndex]
		);
		const nextElement = /** @type {HTMLFormElement} */ (
			controlList[activeElementIndex + next]
		);

		toggleControl(activeElement, nextElement);
		toggleActionButton(activeElementIndex + next, controlList.length, nextButton, previousButton, submitButton);
	}

	nextButton.addEventListener("click", () => {
		changeButton(controlList.length - 1, 1);
	});

	previousButton.addEventListener("click", () => {
		changeButton(0, -1);
	});

	toggleActionButton(0, controlList.length, nextButton, previousButton, submitButton);

	console.log("[IG2I-prices] Form buttons enabled");

});

window.addEventListener('load', () => {
	const htmlForm = document.getElementById("prices-form");
	const displayPrice = document.getElementById("price-display");
	const partenairePrice = document.getElementById("price-centrale");

	const inputList = Array.from(
		htmlForm.getElementsByTagName("input")
	);
	inputList.forEach((element) => {
		element.addEventListener('change', () => {
			recalculateEstimatedPrice(inputList, displayPrice, partenairePrice);
		});
	});

	recalculateEstimatedPrice(inputList, displayPrice, partenairePrice);

	console.log("[IG2I-prices] Price calculator enabled");

});
