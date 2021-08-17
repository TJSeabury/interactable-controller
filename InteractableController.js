import { EventMiddleware } from "event-middleware/Event-Middleware";

export class InteractableController {
    constructor( control, interactable, options = {
        className: 'interactable-active',
        closeOnScroll: true,
        closeOnOutside: true
    } ) {
        const {
            className,
            closeOnScroll,
            closeOnOutside
        } = options;

        this.state = false;
        this.control = control;
        this.interactable = interactable;
        this.options = options;
        this.className = className;

        this.open = this.open.bind( this );
        this.maybeShouldOpen = this.maybeShouldOpen.bind( this );
        this.close = this.close.bind( this );
        this.maybeShouldClose =this.maybeShouldClose.bind( this );
        this.toggle = this.toggle.bind( this );
        this.closeIfInteractedOutside = this.closeIfInteractedOutside.bind( this );

        this.toggle = EventMiddleware.prevent( this.toggle );

        this.control.addEventListener( 'click', this.toggle );
        
        if ( closeOnScroll ) window.addEventListener( 'scroll', this.maybeShouldClose );

        if ( closeOnOutside ) window.addEventListener( 'click', this.closeIfInteractedOutside );
    }

    /**
     * Open the interactable.
     */
    open() {
        this.state = true;
        this.interactable.classList.add( this.className );
    }

    /**
     * Opens the interactable if it is closed.
     * @returns true if interactable has been opened, false otherwise
     */
    maybeShouldOpen() {
        if ( false === this.state ) {
            this.open();
            return true;
        }
        return false;
    }

    /**
     * Close the interactable.
     */
    close() {
        this.state = false;
        this.interactable.classList.remove( this.className );
    }

    /**
     * Closes the interactable if it is open.
     * @returns true if interactable has been closed, false otherwise
     */
    maybeShouldClose() {
        if ( true === this.state ) {
            this.close();
            return true;
        }
        return false;
    }

    /**
     * Saftely toggles the interactable open or closed.
     * @param {Event} ev 
     * @returns false
     */
    toggle() {
        if ( ! this.maybeShouldOpen() ) this.maybeShouldClose();
    }

    /**
     * Closes the interactable if the user interacts with the window outside of the interactable or its control.
     * @param {Event} ev 
     */
    closeIfInteractedOutside( ev ) {
        EventMiddleware.ifNotLocal(
            ev,
            this.maybeShouldClose,
            [],
            [
                this.control,
                this.interactable
            ]
        );
    }

    cleanUp() {
        this.control.removeEventListener( 'click', this.toggle );
        if ( this.options.closeOnScroll ) window.removeEventListener( 'scroll', this.maybeShouldClose );
        if ( this.options.closeOnOutside ) window.removeEventListener( 'click', this.closeIfInteractedOutside );

        this.control = null;
        this.interactable = null;
    }

}