export const isIosPWA = () => {
	return window.matchMedia("(display-mode: standalone)").matches;
};

export const isIos = () => {
	return (
		navigator.userAgent.toLowerCase().match(/mobile/i) &&
		navigator.userAgent.match(/ipad|ipod|iphone/i) &&
		"ontouchend" in document
	);
};
