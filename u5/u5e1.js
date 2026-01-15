// T3. JavaScript profesional en una aplicación web
// U5. APIs: Clipboard
// Enunciado disponible en u5e1.md / Enunciat disponible a u5e1.md

// Escribe aquí tu solución / escriviu aquí la vostra solució:

/**
 * Clase ClipboardApi
 * Wrapper para gestionar el portapapeles del navegador.
 * Student: [Tu Nombre / Gemini]
 */
export class ClipboardApi {
    
    constructor(clipboard) {
        // Inyección de dependencias:
        // Permitimos pasar un mock para testing, o usamos el nativo del navegador como fallback.
        this.clipboard = clipboard || window.navigator.clipboard;
    }

    /**
     * Copia texto al portapapeles.
     * @param {string} text - Texto a copiar
     */
    async copy(text) {
        // El enunciado pide que esperemos por el resultado.
        // writeText devuelve una Promesa que se resuelve (undefined) si todo va bien.
        try {
            return await this.clipboard.writeText(text);
        } catch (err) {
            console.error('Error al copiar al portapapeles:', err);
            throw err; // Re-lanzamos el error por si quien llama quiere manejarlo
        }
    }

    /**
     * Lee el texto actual del portapapeles.
     * @returns {string} El texto contenido en el portapapeles.
     */
    async read() {
        // readText devuelve una Promesa que se resuelve con un String.
        try {
            const text = await this.clipboard.readText();
            return text;
        } catch (err) {
            console.error('Error al leer del portapapeles:', err);
            // Nota: Esto suele fallar si el navegador no tiene foco o permiso explícito.
            throw err;
        }
    }
}