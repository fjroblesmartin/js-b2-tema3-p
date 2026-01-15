// T3. JavaScript profesional en una aplicación web
// U2. Eventos personalizados (custom events)
// Enunciado disponible en u3e1.md / Enunciat disponible a u3e1.md

// Escribe aquí tu solución / escriviu aquí la vostra solució:

/*
   Clase Sender
   Se encarga de emitir eventos personalizados cuando se hace click en el DOM asociado.
 */
class Sender {
    // Propiedades estáticas para los tipos de evento
    static TYPE_A = 'EVENT_NOTIFICATION_A';
    static TYPE_B = 'EVENT_NOTIFICATION_B';

    // Propiedad privada para la referencia al DOM
    #refDom;

    constructor(ref, type) {
        this.#refDom = ref;
        this.type = type; // Tipo de evento (A o B)
        this.count = 0;   // Contador de clicks

        this.init();
        
        // Renderizado inicial (0)
        this.render();
    }

    init() {
        this.#refDom.addEventListener('click', (e) => {
            e.preventDefault(); // Evitamos que el enlace navegue
            this.count++;
            
            this.trigger();
            this.render();
        });
    }

    trigger() {
        // Creamos el evento personalizado.
        // IMPORTANTE: 'bubbles: true' es necesario para que el evento suba 
        // hasta el document, donde escucha el Logger.
        const event = new CustomEvent(this.type, {
            bubbles: true,
            detail: this.count // Pasamos el contador como dato adjunto
        });

        // Despachamos el evento desde el elemento del DOM propio
        this.#refDom.dispatchEvent(event);
    }

    render() {
        // Extraemos la letra final del tipo (ej: 'EVENT_NOTIFICATION_A' -> 'A')
        // Usamos split y pop para coger lo último tras el guion bajo, o la última letra.
        // Dado que sabemos el formato fijo, podemos coger el último caracter.
        const letter = this.type.slice(-1);
        
        this.#refDom.textContent = `${letter}: ${this.count}`;
    }
}

/**
 * Clase Logger
 * Escucha eventos en el document y muestra un log.
 */
class Logger {
    #refDom;
    notificationList = []; // Array público (según enunciado no dice que sea privado #)
    
    // Propiedad privada auxiliar para guardar la función 'bindeada' 
    // y poder eliminarla después en el destroy().
    #boundHandler; 

    constructor(ref) {
        this.#refDom = ref;
        
        // Truco pro: Creamos una referencia fija del método con el contexto 'this' atado.
        // Si no hacemos esto, removeEventListener no funcionará porque bind crea una nueva función cada vez.
        this.#boundHandler = this.onNotificationReceived.bind(this);

        this.init();
    }

    init() {
        // Escuchamos en el document porque los eventos burbujean (bubbles: true)
        document.addEventListener(Sender.TYPE_A, this.#boundHandler);
        document.addEventListener(Sender.TYPE_B, this.#boundHandler);
    }

    onNotificationReceived(e) {
        // Guardamos el objeto de notificación.
        // Usamos unshift para que la más reciente quede la primera (índice 0)
        this.notificationList.unshift({
            type: e.type,
            message: e.detail // El enunciado dice guardar el objeto, aquí guardo una ref limpia
        });

        this.render();
    }

    render() {
        // Limpiamos el contenedor
        this.#refDom.innerHTML = '';

        // Usamos DocumentFragment para eficiencia (evitar múltiples reflows)
        const fragment = document.createDocumentFragment();

        this.notificationList.forEach(notification => {
            const p = document.createElement('p');
            p.textContent = `${notification.type}: ${notification.message}`;
            fragment.appendChild(p);
        });

        this.#refDom.appendChild(fragment);
    }

    destroy() {
        // Eliminamos los listeners usando la MISMA referencia guardada en el constructor
        document.removeEventListener(Sender.TYPE_A, this.#boundHandler);
        document.removeEventListener(Sender.TYPE_B, this.#boundHandler);
        
        console.log('Logger destroyed. Listeners removed.');
    }
}


// --- C. Llamadas adicionales (Testing) ---

console.log('--- Iniciando Aplicación ---');

const notificationADom = document.querySelector('.js-notification-A');
const notificationBDom = document.querySelector('.js-notification-B');
const loggerDom = document.querySelector('.js-logger');

// Instanciación
const nA = new Sender(notificationADom, Sender.TYPE_A);
const nB = new Sender(notificationBDom, Sender.TYPE_B);
const logger = new Logger(loggerDom);

// Simulación de clicks
console.log('Simulando clicks...');
notificationADom.click(); // A: 1
notificationADom.click(); // A: 2
notificationBDom.click(); // B: 1
notificationBDom.click(); // B: 2
notificationBDom.click(); // B: 3
notificationBDom.click(); // B: 4
notificationADom.click(); // A: 3

// Destruir logger
console.log('Destruyendo logger...');
logger.destroy();

// Estos clicks ya no deberían registrarse en el logger (pero sí actualizarán el botón Sender)
console.log('Clicks post-destroy...');
notificationADom.click(); // A: 4
notificationBDom.click(); // B: 5