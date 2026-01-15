// T3. JavaScript profesional en una aplicación web
// U1. Trabajo avanzado con el DOM
// Enunciado disponible en u1e1.md / Enunciat disponible a u1e1.md

//Escribe aquí tu solución / escriviu aquí la vostra solució:


// A. Función getItems
// Uso arrow function por concisión.
const getItems = () => {
    // Selecciono todos los nodos. Esto devuelve un NodeList.
    const nodeList = document.querySelectorAll('.js-item');

    // Convierto el NodeList a Array usando spread operator [...] para poder usar .map()
    // Es más "functional approach" que un bucle for.
    return [...nodeList].map(item => {
        // Uso dataset para acceder a los atributos data-* de forma limpia
        return {
            id: item.dataset.id,
            es: item.dataset.es,
            en: item.dataset.en
        };
    });
};

// B. Función emptyList
const emptyList = () => {
    const listContainer = document.querySelector('.js-list');
    
    // Safety check: verifico que el elemento existe antes de manipularlo
    if (listContainer) {
        // innerHTML vacío es la forma estándar de limpiar el contenido
        listContainer.innerHTML = '';
    }
};

// C. Función renderList
const renderList = (itemList, lang) => {
    // 1. Vaciamos la lista previa como pide el enunciado
    emptyList();

    const listContainer = document.querySelector('.js-list');
    if (!listContainer) return;

    // Genero todo el HTML en un solo string usando .map() y .join('')
    // Esto es más eficiente (menos reflows) que hacer un appendChild en cada iteración.
    const listHTML = itemList.map(item => {
        // Accedo dinámicamente a la propiedad del idioma (item['es'] o item['en'])
        const translatedWord = item[lang]; 
        
        return `<li class="js-item" data-id="${item.id}" data-es="${item.es}" data-en="${item.en}">${translatedWord}</li>`;
    }).join('');

    // Inserto el HTML de una sola vez
    listContainer.innerHTML = listHTML;
};

// D. Función updateItemStyle
const updateItemStyle = (idItem) => {
    // Uso un selector de atributo específico para encontrar el elemento directo.
    // Es más performante que buscar todos y filtrar.
    const targetItem = document.querySelector(`.js-item[data-id="${idItem}"]`);

    // Si el elemento existe, añado la clase usando la API classList
    if (targetItem) {
        targetItem.classList.add('highlight');
    } else {
        console.warn(`Item with id ${idItem} not found.`);
    }
};

// E. Aplicar código (Ejecución)
// Envuelvo la ejecución en un bloque o IIFE si quisiera aislar scope, 
// pero lo dejo plano como pide el ejercicio.

console.log('--- Iniciando ejecución del script ---');

// 1. Extraer elementos iniciales
const words = getItems();
console.log('Words extracted:', words);

// 2. Renderizar la lista en inglés ('en')
// Nota: Verás que en el navegador cambia el texto de "Primero" a "First", etc.
renderList(words, 'en');

// 3. Resaltar el item con id 2
updateItemStyle('2'); // Paso string porque data-id suele ser string, aunque JS hace coerción si paso number.

// 4. Resaltar el item con id 4
updateItemStyle('4');

console.log('--- Ejecución finalizada ---');