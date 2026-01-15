// T3. JavaScript profesional en una aplicación web
// U2. Delegación de eventos
// Enunciado disponible en u2e1.md / Enunciat disponible a u2e1.md

const TASK_LIST = [
    {
        name: 'Work',
        done: false,
    },
    {
        name: 'Shopping',
        done: false,
    },
    {
        name: 'Call mom',
        done: true,
    },
];

// Escribe aquí tu solución / escriviu aquí la vostra solució:

/**
 * Clase TodoList
 * Gestiona una lista de tareas usando Event Delegation y Templates.
 */
class TodoList {
    // Propiedades privadas (Private fields)
    #appRef;
    #listRef;
    #todoTpl;

    // Propiedad pública
    list = [];

    constructor(appRef, listRef, todoTpl) {
        this.#appRef = appRef;
        this.#listRef = listRef;
        this.#todoTpl = todoTpl;

        this.init();
    }

    /**
     * Inicializa los listeners.
     * Aquí es donde aplicamos la DELEGACIÓN DE EVENTOS real.
     */
    init() {
        // 1. Evento para añadir nueva tarea
        const addBtn = this.#appRef.querySelector('.js-todo-add');
        const inputName = this.#appRef.querySelector('.js-todo-new-name');

        addBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evitamos navegación del link
            const newName = inputName.value.trim();
            
            // Intentamos añadir. Si devuelve true (éxito), limpiamos el input
            if (this.add(newName, false)) {
                inputName.value = '';
            }
        });

        // 2. DELEGACIÓN DE EVENTOS (Event Delegation)
        // En lugar de añadir listeners en el render(), escuchamos en el contenedor padre (#listRef)
        // e interceptamos los clicks que suben (bubbling) desde los hijos.
        this.#listRef.addEventListener('click', (e) => {
            // Buscamos si el click ocurrió dentro de un botón de acción o en el propio botón
            const targetDone = e.target.closest('.js-todo-done');
            const targetDelete = e.target.closest('.js-todo-delete');
            
            // Obtenemos el elemento LI padre para saber qué tarea es (data-todo)
            const todoItem = e.target.closest('.js-todo');
            
            if (!todoItem) return; // Si clickamos fuera de una tarea, no hacemos nada

            const todoName = todoItem.dataset.todo;

            // Acción: Toggle Done
            if (targetDone) {
                e.preventDefault();
                this.toggle(todoName);
            }

            // Acción: Remove
            if (targetDelete) {
                e.preventDefault();
                this.remove(todoName);
            }
        });
    }

    /**
     * Añade una tarea a la lista si es válida y no existe.
     */
    add(todo, status) {
        // Validación: Cadena vacía
        if (!todo || todo.trim() === '') return false;

        // Validación: Duplicados (case sensitive según enunciado)
        const exists = this.list.some(item => item.name === todo);
        if (exists) return false;

        // Añadir a la lista
        this.list.push({
            name: todo,
            done: status
        });

        this.render();
        return true;
    }

    /**
     * Elimina una tarea por nombre.
     */
    remove(name) {
        // Filtramos para dejar todos MENOS el que coincide
        this.list = this.list.filter(item => item.name !== name);
        this.render();
    }

    /**
     * Cambia el estado (done/pending) de una tarea.
     */
    toggle(name) {
        const item = this.list.find(t => t.name === name);
        if (item) {
            item.done = !item.done; // Invertimos booleano
            this.render();
        }
    }

    /**
     * Renderiza la lista en el DOM usando el Template.
     */
    render() {
        // Borramos contenido previo
        this.#listRef.innerHTML = '';

        if (!this.#todoTpl) return; // Safety check

        // Usamos DocumentFragment para mejor rendimiento (menos reflows)
        const fragment = document.createDocumentFragment();

        this.list.forEach(task => {
            // Clonamos template
            const clone = this.#todoTpl.content.cloneNode(true);
            const li = clone.querySelector('.js-todo');

            // Rellenamos atributos DATA
            li.dataset.todo = task.name;
            li.dataset.done = task.done;

            // Rellenamos contenido visual
            clone.querySelector('.js-todo-name').textContent = task.name;
            
            const doneBtn = clone.querySelector('.js-todo-done');
            // Lógica de texto pedida en el enunciado (H)
            if (task.done) {
                doneBtn.textContent = 'done';
            } else {
                doneBtn.textContent = 'pending';
            }

            fragment.appendChild(clone);
        });

        this.#listRef.appendChild(fragment);
    }
}

// --- K. INSTANCIACIÓN ---

// Seleccionamos nodos necesarios
const appNode = document.getElementById('app');
const listNode = document.querySelector('.js-todo-list');
const tplNode = document.getElementById('tpl-todo');

// Creamos la instancia
const todosApp = new TodoList(appNode, listNode, tplNode);


// --- L. GENERACIÓN INICIAL ---

// Cargamos las tareas del array global TASK_LIST
console.log('--- Initializing Tasks ---');
TASK_LIST.forEach(task => {
    todosApp.add(task.name, task.done);
});


// --- M. LLAMADAS ADICIONALES (Tests) ---
console.log('--- Running Tests ---');

// 1. Pruebas directas a métodos
todosApp.add('New one', false);
todosApp.toggle('Shopping');
todosApp.remove('Call mom');
todosApp.add('Another one', true);

// 2. Simulación de interacción UI (Añadir tarea 'Test')
const inputField = document.querySelector('.js-todo-new-name');
const addBtn = document.querySelector('.js-todo-add');

if (inputField && addBtn) {
    inputField.value = 'Test';
    addBtn.click(); // Dispara el evento click programáticamente
}

// 3. Simulación de clicks delegados (Completar y Borrar)
// Necesitamos un pequeño timeout o asegurar que el DOM se pintó, 
// pero como el render es síncrono, debería funcionar directo.

const newOneBtn = document.querySelector('.js-todo[data-todo="New one"] .js-todo-done');
if (newOneBtn) newOneBtn.click();

const anotherOneDelete = document.querySelector('.js-todo[data-todo="Another one"] .js-todo-delete');
if (anotherOneDelete) anotherOneDelete.click();

console.log('--- Tests Completed ---');