import ReactDOM from 'react-dom/client';
import React from 'react';
import './Dialog.css';

const CLASS_NAME = 'native-dialog';

export class Dialog {
	constructor() {
		this.Content = null; // Initialize content as null
		this.visible = false;
		this.dialogElement = null;
		this.root = null;

		this.enableCloseOnOutsideClick = false;

		// Remove all dialogs with the class 'dialog-native'
		const existingDialogs = document.querySelectorAll('.dialog-native');
		existingDialogs.forEach(dialog => {
			dialog.remove(); // Removes each dialog with class 'dialog-native'
		});
	}

	closeOnClickOutside(state) {
		this.enableCloseOnOutsideClick = state;

		if (!this.dialogElement) return;

		// Remove any existing listener to avoid duplicates
		this.dialogElement.removeEventListener('click', this._outsideClickHandler);

		if (state) {
			// Define and bind the outside click handler
			this._outsideClickHandler = (e) => {
				if (e.target === this.dialogElement) {
					this.hide();
				}
			};
			this.dialogElement.addEventListener('click', this._outsideClickHandler);
		}
	}

	/**
	 * Sets up the dialog content and element.
	 * This method can be called whenever you need to set the dialog up (e.g., after changing content).
	 * @param {React.ReactNode} Content - React content to display inside the dialog
	 */
	set(Content) {
		// If dialog is already set, we simply replace the content
		this.Content = Content;

		// Check if a dialog with the same class already exists
		const existing = document.querySelector(`dialog.${CLASS_NAME}`);
		if (existing) {
			const existingRoot = ReactDOM.createRoot(existing);
			existingRoot.unmount();
			existing.remove();
		}

		// Create new dialog element
		this.dialogElement = document.createElement('dialog');
		this.dialogElement.className = `${CLASS_NAME} dialog-native`; // Adding 'dialog-native' to the class name
		document.body.appendChild(this.dialogElement);

		this.root = ReactDOM.createRoot(this.dialogElement);

		this.dialogElement.addEventListener('close', () => {
			this.visible = false;
			this.root.render(null);
		});
	}

	/**
	 * Shows the dialog.
	 */
	show() {
		if (this.visible) return;

		if (!this.dialogElement || !this.root || !this.Content) {
			this.set(this.Content);
		}

		this.visible = true;

		const isDiv = this.Content.type === 'div';

		this.root.render(
			isDiv ? (
				React.cloneElement(this.Content, { onClick: (e) => e.stopPropagation() })
			) : (
				<div style={{ width: "100%", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
					{this.Content}
				</div>
			)
		);

		// Attach click outside listener based on setting
		this.closeOnClickOutside(this.enableCloseOnOutsideClick);

		this.dialogElement.showModal();
	}

	/**
	 * Hides the dialog.
	 */
	hide() {
		if (!this.visible) return;
		this.dialogElement.close(); // Triggers 'close' event
	}

	/**
	 * Destroys the dialog and removes it from the DOM.
	 */
	destroy() {
		this.hide();
		this.root.unmount();
		document.body.removeChild(this.dialogElement);
	}
}