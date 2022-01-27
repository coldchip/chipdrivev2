/*
	@title: IDK modal
	@author: Ryan Loh
	@description: A custom modal generator
*/


var prompt = (title, callback) => {

	var header = $(`<div class="cd-modal-header"></div>`);
	var title = $(`<p class="cd-modal-title text"></p>`).text(title);
	header.append(title);

	var form = $(`
		<form class="cd-modal-form">
			
		</form>
	`);

	var input = $(`<input type="input" class="cd-modal-input text">`);
	form.append(input);

	var body = $(`<div class="cd-modal-body"></div>`);
	body.append(form);

	var footer = $(`
		<div class="cd-modal-footer">

		</div>
	`);

	var cancel = $(`<button class="cd-modal-button text">CANCEL</button>`);
	var okay = $(`<button class="cd-modal-button text">OK</button>`);

	footer.append(cancel);
	footer.append(okay);

	var container = $(`
		<div class="cd-modal">

		</div>
	`);

	container.append(header);
	container.append(body);
	container.append(footer);

	var dialog = bootbox.dialog({ 
		message: container, 
		size: 'small',
		onEscape: true,
		closeButton: false 
	});

	cancel.on("click", () => {
		dialog.modal('hide');
	});

	okay.on("click", () => {
		var text = input.val();
		dialog.modal('hide');
		callback(text);
	});
}

var alert = (title, callback) => {
	var title = $(`<p class="cd-modal-title text"></p>`).text(title);

	var header = $(`<div class="cd-modal-header"></div>`);
	header.append(title);

	var footer = $(`
		<div class="cd-modal-footer">

		</div>
	`);

	var okay = $(`<button class="cd-modal-button text">OK</button>`);

	footer.append(okay);

	var container = $(`
		<div class="cd-modal">

		</div>
	`);

	container.append(header);
	container.append(footer);

	var dialog = bootbox.dialog({ 
		message: container, 
		size: 'small',
		onEscape: true,
		closeButton: false 
	});

	okay.on("click", () => {
		dialog.modal('hide');
		if(callback) {
			callback();
		}
	});
}

var confirm = (title, callback) => {
	var title = $(`<p class="cd-modal-title text"></p>`).text(title);

	var header = $(`<div class="cd-modal-header"></div>`);
	header.append(title);

	var footer = $(`
		<div class="cd-modal-footer">

		</div>
	`);

	var cancel = $(`<button class="cd-modal-button text">CANCEL</button>`);
	var okay = $(`<button class="cd-modal-button text">OK</button>`);

	footer.append(cancel);
	footer.append(okay);

	var container = $(`
		<div class="cd-modal">

		</div>
	`);

	container.append(header);
	container.append(footer);

	var dialog = bootbox.dialog({ 
		message: container, 
		size: 'small',
		onEscape: true,
		closeButton: false 
	});

	cancel.on("click", () => {
		dialog.modal('hide');
	});

	okay.on("click", () => {
		dialog.modal('hide');
		callback();
	});
}

var loader = (text, callback) => {
	var container = $(`<div class="cd-modal"></div>`);

	var dialog = bootbox.dialog({ 
		message: container, 
		size: 'small',
		onEscape: true,
		closeButton: false 
	});

	container.append(`
		<div class="col-12 d-flex align-items-center justify-content-center">
			<div class="spinner-border spinner">
				<span class="sr-only">Loading...</span>
			</div>
		</div>
	`);

	var textContainer = $(`
		<div class="col-12 d-flex align-items-center justify-content-center cd-modal-loader-text text mt-3">

		</div>
	`);
	textContainer.append(text);

	container.append(textContainer)

	dialog.on('shown.bs.modal', () => {
		callback(dialog);
	});
}

var dialog = (config) => {
	var container = $(`<div class="cd-modal"></div>`);

	var dialog = bootbox.dialog({ 
		message: container, 
		size: config.size,
		onEscape: config.onEscape,
		closeButton: false
	});

	if(config.title || config.closeButton == true) {
		var header = $(`<div class="cd-modal-header"></div>`);

		var title = $(`<p class="cd-modal-title text"></p>`).text(config.title);

		var x = $(`<i class="fas fa-times-circle cd-modal-x"></i>`);

		x.on("click", () => {
			dialog.modal("hide");
		});

		header.append(title);
		header.append(x);

		container.append(header);
	}

	var body = $(`<div class="cd-modal-body"></div>`);
	body.append(config.message);

	container.append(body);

	return dialog;
}

var modal = { prompt, alert, confirm, dialog, loader };