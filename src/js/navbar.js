/// @ts-check

/**
 * Load navbar menu toggles for mobile
 * @param {HTMLElement} element
 */
const navbarToggles = (element) => {
	// Get the target from the "data-target" attribute
	const target = document.getElementById(element.dataset.target);

	element.parentElement.classList.toggle("navbar");
	element.parentElement.classList.toggle("is-primary");

	element.classList.toggle('is-active');
	target.classList.toggle('is-active');
}

/**
 * Set navbar transparent if under scrollValue
 * @param {HTMLElement} element
 * @param {number} scrollValue
 */
const scrollBackground = (element, scrollValue) => {
	const scroll = window.scrollY || window.pageYOffset;
	if (scroll < scrollValue) {
		element.classList.add('is-transparent-color');
		element.classList.remove('is-primary');
	} else {
		element.classList.add('is-primary');
		element.classList.remove('is-transparent-color');
	}
};

// Enable navbar-burger buttons
window.addEventListener('load', () => {
	// Get all "navbar-burger" elements
	const navbarBurgers = document.getElementsByClassName('navbar-burger');
	const navbarButtonsBurgers = document.getElementsByClassName('navbar-end');

	Array.from(navbarBurgers).forEach((/** @type {HTMLElement} */ navbarElement) => {
		navbarElement.addEventListener('click', () => {
			navbarToggles(navbarElement);
		});

		Array.from(navbarButtonsBurgers).forEach((/** @type {HTMLElement} */ content) => {
			content.addEventListener('click', () => {
				navbarToggles(navbarElement);
			});
		});
	});

	console.log("[IG2I-navbar] Enabled %s navbar-burger button", navbarBurgers.length);

});

// Enable scrolling transparency
window.addEventListener('load', () => {

	const navbars = document.getElementsByClassName('navbar');

	const scrollValue = 100;

	Array.from(navbars).forEach((/** @type {HTMLElement} */ element) => {
		// Do a first call, to set the right value now
		scrollBackground(element, scrollValue);
		window.addEventListener('scroll', () => {
			scrollBackground(element, scrollValue);
		});
	});

	console.log("[IG2I-navbar] Enabled %s scrolling transparency", navbars.length);


});
