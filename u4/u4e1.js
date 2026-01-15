// T3. JavaScript profesional en una aplicación web
// U4. Almacenamiento local (Cookies)
// Enunciado disponible en u4e1.md / Enunciat disponible a u4e1.md

// Escribe aquí tu solución / escriviu aquí la vostra solució:

/**
 * Clase CookieApi
 * Facilita la gestión de cookies permitiendo almacenar objetos complejos (JSON).
 * Student: [Tu Nombre / Gemini]
 */
export class CookieApi {
    // Propiedad estática con los días por defecto (365)
    static EXPIRING_DAYS = 365;

    constructor(document) {
        // Inyección de dependencia:
        // Si nos pasan un 'document' (ej: un mock para tests), lo usamos.
        // Si no, usamos el 'window.document' real del navegador.
        this.document = document || window.document;
    }

    /**
     * Calcula la fecha de expiración sumando nDays a la fecha actual.
     * @param {number} nDays 
     * @returns {string} Fecha en formato UTCString
     */
    static expirationDate(nDays) {
        const date = new Date();
        // Multiplicamos días * horas * minutos * segundos * milisegundos
        date.setTime(date.getTime() + (nDays * 24 * 60 * 60 * 1000));
        return date.toUTCString();
    }

    /**
     * Guarda una cookie convirtiendo el valor a JSON.
     * @param {string} key - Nombre de la cookie
     * @param {any} value - Valor a guardar (se stringifica)
     * @param {number} nDays - Días de vida (opcional)
     */
    setCookie(key, value, nDays = CookieApi.EXPIRING_DAYS) {
        const expires = CookieApi.expirationDate(nDays);
        
        // Convertimos el valor a string JSON para soportar objetos complejos
        const jsonValue = JSON.stringify(value);
        
        // Es buena práctica usar encodeURIComponent para evitar problemas con caracteres especiales en la cookie
        const cookieValue = encodeURIComponent(jsonValue);

        this.document.cookie = `${key}=${cookieValue}; expires=${expires}; path=/`;
    }

    /**
     * Recupera una cookie y la parsea de JSON a objeto.
     * @param {string} key 
     * @returns {any|null} El objeto parseado o null si no existe.
     */
    getCookie(key) {
        const nameEq = key + "=";
        const ca = this.document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            
            // Eliminamos espacios en blanco al principio (típico formato cookie: "key=val; key2=val2")
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }

            // Si encontramos la clave
            if (c.indexOf(nameEq) === 0) {
                // Extraemos el valor bruto
                const rawValue = c.substring(nameEq.length, c.length);
                
                try {
                    // Decodificamos y parseamos el JSON
                    return JSON.parse(decodeURIComponent(rawValue));
                } catch (e) {
                    // Si falla el parseo (por si la cookie no era JSON), devolvemos null o el valor crudo
                    console.error('Error parsing cookie JSON', e);
                    return null;
                }
            }
        }
        return null;
    }

    /**
     * Elimina una cookie forzando su expiración.
     * @param {string} key 
     */
    removeCookie(key) {
        // Para borrar, reescribimos la cookie con valor vacío y fecha de expiración 0 (pasado)
        this.setCookie(key, '', 0);
    }
}