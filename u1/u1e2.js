// T3. JavaScript profesional en una aplicación web
// U1. Trabajo avanzado con el DOM
// Enunciado disponible en u1e2.md / Enunciat disponible a u1e2.md


const CATEGORY_LIST = [
    {
        id: 1,
        name: 'design'
    }, {
        id: 2,
        name: 'development'
    }, {
        id: 3,
        name: 'consultancy'
    }
];

const PROJECT_LIST = [
    {
        id: 1,
        name: 'First Project',
        excerpt: 'Lorem <strong>ipsum</strong> dolor quan aemet...',
        categoryId: 2,
        progress: 90,
        archived: false,
        search: ['wordA', 'wordB', 'wordC'],
        tags: ['tag1', 'tag2']
    }, {
        id: 2,
        name: 'Second Project',
        excerpt: 'Lorem ipsum dolor quan aemet...',
        categoryId: 2,
        progress: 50,
        archived: false,
        search: ['wordA', 'wordD'],
        tags: ['tag3']
    }, {
        id: 3,
        name: 'Third Project',
        excerpt: 'Lorem ipsum dolor quan aemet...',
        categoryId: 1,
        progress: 20,
        archived: false,
        search: ['wordB', 'wordC'],
        tags: ['tag1', 'tag3']
    }, {
        id: 4,
        name: 'Fourth Project',
        excerpt: 'Lorem ipsum dolor quan aemet...',
        categoryId: 3,
        progress: 100,
        archived: true,
        search: ['wordA', 'wordB'],
        tags: ['tag2']
    }, {
        id: 5,
        name: 'Fifth Project',
        excerpt: 'Lorem ipsum dolor quan aemet...',
        categoryId: 3,
        progress: 100,
        archived: false,
        search: ['wordA', 'wordC', 'wordD'],
        tags: ['tag1', 'tag2', 'tag3']
    }, {
        id: 6,
        name: 'Sixth Project',
        excerpt: 'Lorem ipsum <strong>dolor quan</strong> aemet...',
        categoryId: 2,
        progress: 100,
        archived: true,
        search: ['wordA', 'wordB', 'wordD'],
        tags: ['tag1']
    },
];

// Escribe aquí tu solución / escriviu aquí la vostra solució:

/**
 * Función renderProjects
 * Renderiza la lista de proyectos utilizando Templates y DocumentFragment para optimizar el DOM.
 */
const renderProjects = () => {
    // 1. Selección de elementos del DOM
    const listContainer = document.querySelector('.js-project-list');
    const tplProject = document.querySelector('#tpl-project');
    const tplTag = document.querySelector('#tpl-tag');

    // Comprobación de seguridad (por si el HTML no carga bien)
    if (!listContainer || !tplProject || !tplTag) {
        console.error('Error: Faltan elementos clave en el DOM (contenedor o templates).');
        return;
    }

    // 2. Creamos un fragmento para "cocinar" todo el DOM en memoria antes de inyectarlo
    // Esto mejora mucho el rendimiento (reduce Reflows).
    const fragment = document.createDocumentFragment();

    // 3. Iteramos sobre los proyectos
    PROJECT_LIST.forEach(project => {
        // Clonamos el contenido del template de proyecto (deep clone = true)
        const projectClone = tplProject.content.cloneNode(true);
        
        // Seleccionamos el nodo raíz del proyecto dentro del clon
        const projectNode = projectClone.querySelector('.js-project');

        // --- Atributos DATA ---
        projectNode.dataset.id = project.id;
        // Convertimos arrays a string separado por comas
        projectNode.dataset.tags = project.tags.join(',');
        projectNode.dataset.search = project.search.join(',');
        projectNode.dataset.archived = project.archived;

        // --- Clases condicionales ---
        if (project.archived) {
            projectNode.classList.add('archived');
        }
        if (project.progress === 100) {
            projectNode.classList.add('completed');
        }

        // --- Contenido de texto ---
        projectClone.querySelector('.js-name').textContent = project.name;
        projectClone.querySelector('.js-progress').textContent = project.progress;
        
        // El excerpt puede tener HTML, así que usamos innerHTML
        projectClone.querySelector('.js-excerpt').innerHTML = project.excerpt;

        // --- Categoría ---
        // Buscamos la categoría correspondiente por ID
        const category = CATEGORY_LIST.find(cat => cat.id === project.categoryId);
        // Si no existe (safety check), ponemos un fallback
        projectClone.querySelector('.js-category').textContent = category ? category.name : 'Unknown';

        // --- Tags (Sub-lista) ---
        const tagsContainer = projectClone.querySelector('.js-tags');
        // Vaciamos por seguridad
        tagsContainer.innerHTML = '';

        project.tags.forEach(tagName => {
            // Clonamos el template de tag para cada etiqueta
            const tagClone = tplTag.content.cloneNode(true);
            const tagLink = tagClone.querySelector('.js-tag-link');

            tagLink.dataset.tag = tagName;
            tagLink.textContent = tagName;
            tagLink.href = '#'; // Placeholder para el href

            tagsContainer.appendChild(tagClone);
        });

        // Añadimos el proyecto completo al fragmento general
        fragment.appendChild(projectClone);
    });

    // 4. Limpieza e Inyección final
    // Vaciamos la lista actual para evitar duplicados si llamamos a la función varias veces
    listContainer.innerHTML = '';
    
    // Inyectamos todo de golpe 🚀
    listContainer.appendChild(fragment);
};

// D. Llamada inicial
// Ejecutamos la función para pintar los datos
renderProjects();