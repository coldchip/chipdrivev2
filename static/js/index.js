$(document).ready(() => {
	// sidebar event handler
	$(`
		.header .hamburger,
		.coldchip-sidebar .sidebar-close .cross,
		.coldchip-sidebar-backdrop
	`).on("click", () => {
		$(".coldchip-sidebar").toggleClass("coldchip-sidebar-hidden");
		$(".coldchip-sidebar-backdrop").toggle();
	});
});