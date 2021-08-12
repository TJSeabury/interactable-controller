export class EventMiddleware {

    static sendToEvent( message, ...args ) {
        return fn => e => {
            e[message]( ...args )
            return fn( e )
        };
    }

    static stop( fn ) {
        return e => {
            e.stopPropagation();
            return fn( e );
        };
    } 

    static prevent( fn ) {
        return e => {
            e.preventDefault();
            return fn( e );
        };
    }
    
    static isKey( key ) {
        return fn => e => {
            if ( e.key === key ) {
              return fn( e )
            }
            return e
        };
    }

    /**
     * Tests if an event originated in a set of elements.
     * @param {Event} event 
     * @param {Array<Element>} elements 
     * @returns True if event origin is in the elements set, false otherwise
     */
    static isLocal( event, elements = [ event.target ] ) {
        if ( ! event || ! event.target || ! elements || elements.length <= 0 ) {
            console.error( `Bad arguements in method ${this.isLocalEventOrigin.name}!`, ...arguments );
            return;
        }
        let currentElement = event.target;
        do {
            for ( const element of elements ) {
                if ( currentElement == element ) {
                    return true;
                }
            }
        } while ( ( currentElement = currentElement.parentElement ? currentElement.parentElement : false ) );
        return false;
    }

    static ifLocal( event, fn, args, elements = [ event.target ] ) {
        if ( this.isLocal( event, elements ) ) {
            return fn( ...args );
        }
    }

    static ifNotLocal( event, fn, args, elements = [ event.target ] ) {
        if ( ! this.isLocal( event, elements ) ) {
            return fn( ...args );
        }
    }



}


