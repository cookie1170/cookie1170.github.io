let tasks;

if (document.cookie.length > 1) {
    tasks = JSON.parse(document.cookie);
} else {
    tasks = [
        {
            title: "My very cool task!",
            desc: "Do some cool stuff! Very cool stuff!",
            done: false
        },
        {
            title: "Another task",
            desc: "Do more things",
            done: false
        },
        {
            title: "Third task",
            desc: "Do a third thingy",
            done: true
        },
        {
            title: "More tasks",
            desc: "Do some more tasks\nThis one is multiline!",
            done: false
        }
    ];
}

addTasks(tasks);

const titleInput = document.querySelector("#title");
const descInput = document.querySelector("#desc");

document.querySelector("#add-task").addEventListener("click", () => {
    const task = {
        title: titleInput.value.trim(),
        desc: descInput.value.trim(),
        done: false
    }
    createTask(task);

    titleInput.value = "";
    descInput.value = "";
})

document.querySelector("#clear-all").addEventListener("click", async () => {
    const length = tasks.length;
    for (let i = 0; i < length; i++) {
        await removeTask(0);
    }
})

function createTask(task) {
    if (task.title.length <= 0)
    {
        alert("Please input task title");
        return;
    }

    for (const item of tasks)
    {
        if (item.title == task.title)
        {
            alert(`Task with title "${task.title}" already exists!`);
            return;
        }
    }

    tasks.push(task);
    addTask(task.title, task.desc, task.done);
    document.cookie = JSON.stringify(tasks);
}

async function removeTask(index) {
    tasks.splice(index, 1);
    const taskContainer = document.querySelector("#tasks");
    const element = taskContainer.children[index];
    element.classList.toggle("hidden");
    console.log(`Removing task at index ${index}`);
    document.cookie = JSON.stringify(tasks);
    await new Promise(resolve => setTimeout(resolve, 200));
    taskContainer.removeChild(element)
}

function calculateIndex(title) {
    for (let i = 0; i < tasks.length; i++)
    {
        if (tasks[i].title === title) return i;
    }
}

async function addTask(title, desc, done) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.classList.toggle("hidden");

    const header = document.createElement("div");
    header.classList.add("header");
    task.appendChild(header);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.defaultChecked = done;
    header.appendChild(checkbox);

    checkbox.addEventListener("change", () => {
        tasks[calculateIndex(title)].done = checkbox.checked;
        document.cookie = JSON.stringify(tasks);
        console.log(`Checked at index ${calculateIndex(title)} changed to ${checkbox.checked}`)
    });

    const trash = document.createElement("button");
    trash.classList.add("trash-button");
    trash.addEventListener("click", () => removeTask(calculateIndex(title)));
    header.appendChild(trash);

    const titleInput = document.createElement("input");
    titleInput.value = title;
    titleInput.classList.add("title-input");
    header.appendChild(titleInput);

    titleInput.addEventListener("change", () => {
        tasks[calculateIndex(title)].title = titleInput.value;
        document.cookie = JSON.stringify(tasks);
        console.log(`Title at index ${calculateIndex(title)} changed to ${titleInput.value}`)
    });

    const description = document.createElement("textarea");
    description.innerHTML = desc;
    description.style.border = "none";
    description.rows = 3;
    task.appendChild(description);

    description.addEventListener("change", () => {
        tasks[calculateIndex(title)].desc = description.value;
        document.cookie = JSON.stringify(tasks);
        console.log(`Description at index ${calculateIndex(title)} changed to ${description.value}`)
    })

    const content = document.querySelector("#tasks");
    content.appendChild(task);

    await new Promise(resolve => {
        setTimeout(resolve, 100)
    });
    task.classList.toggle("hidden");
}

async function addTasks(tasks) {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        await addTask(task.title, task.desc, task.done);
    }
}
