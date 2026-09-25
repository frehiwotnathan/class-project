const classForm = document.getElementById("classForm");
const classList = document.getElementById("classList");

let classes = JSON.parse(localStorage.getItem("classes")) || [];

function saveClasses() {
  localStorage.setItem("classes", JSON.stringify(classes));
}

function displayClasses() {
  classList.innerHTML = "";

  if (classes.length === 0) {
    classList.innerHTML = "<p>No classes added yet.</p>";
    return;
  }

  classes.forEach(function (classItem) {
    const classElement = document.createElement("div");

    classElement.className = "class-item";

    classElement.innerHTML = `
      <h4>${classItem.name}</h4>
      <p>Teacher: ${classItem.teacher}</p>
      <p>Schedule: ${classItem.schedule}</p>
      <button class="delete-button" onclick="deleteClass(${classItem.id})">
        Delete
      </button>
    `;

    classList.appendChild(classElement);
  });
}

classForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const className = document.getElementById("className").value;
  const teacherName = document.getElementById("teacherName").value;
  const classSchedule = document.getElementById("classSchedule").value;

  const newClass = {
    id: Date.now(),
    name: className,
    teacher: teacherName,
    schedule: classSchedule
  };

  classes.push(newClass);

  saveClasses();
  displayClasses();

  classForm.reset();
});

function deleteClass(classId) {
  classes = classes.filter(function (classItem) {
    return classItem.id !== classId;
  });

  saveClasses();
  displayClasses();
}

displayClasses();

const noteForm = document.getElementById("noteForm");
const noteClass = document.getElementById("noteClass");
const noteList = document.getElementById("noteList");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function updateClassOptions() {
  noteClass.innerHTML = '<option value="">Select a class</option>';

  classes.forEach(function (classItem) {
    const option = document.createElement("option");

    option.value = classItem.name;
    option.textContent = classItem.name;

    noteClass.appendChild(option);
  });
}

function displayNotes() {
  noteList.innerHTML = "";

  if (notes.length === 0) {
    noteList.innerHTML = "<p>No notes created yet.</p>";
    return;
  }

  notes.forEach(function (note) {
    const noteElement = document.createElement("div");
    noteElement.className = "note-item";

    const titleElement = document.createElement("h4");
    titleElement.textContent = note.title;

    const classElement = document.createElement("strong");
    classElement.textContent = note.className;

    const contentElement = document.createElement("p");
    contentElement.textContent = note.content;

    const dateElement = document.createElement("p");
    dateElement.className = "note-date";
    dateElement.textContent = `Created: ${note.date}`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "note-delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteNote(note.id);
    });

    noteElement.appendChild(titleElement);
    noteElement.appendChild(classElement);
    noteElement.appendChild(contentElement);
    noteElement.appendChild(dateElement);
    noteElement.appendChild(deleteButton);

    noteList.appendChild(noteElement);
  });
}

noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("noteTitle").value;
  const selectedClass = noteClass.value;
  const content = document.getElementById("noteContent").value;

  const newNote = {
    id: Date.now(),
    title: title,
    className: selectedClass,
    content: content,
    date: new Date().toLocaleDateString()
  };

  notes.unshift(newNote);

  saveNotes();
  displayNotes();

  noteForm.reset();
});

function deleteNote(noteId) {
  notes = notes.filter(function (note) {
    return note.id !== noteId;
  });

  saveNotes();
  displayNotes();
}

updateClassOptions();
displayNotes();
// this is for assignemnt 
const assignmentForm = document.getElementById("assignmentForm");
const assignmentClass = document.getElementById("assignmentClass");
const assignmentList = document.getElementById("assignmentList");

let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

function saveAssignments() {
  localStorage.setItem("assignments", JSON.stringify(assignments));
}

function updateAssignmentClassOptions() {
  assignmentClass.innerHTML =
    '<option value="">Select a class</option>';

  classes.forEach(function (classItem) {
    const option = document.createElement("option");

    option.value = classItem.name;
    option.textContent = classItem.name;

    assignmentClass.appendChild(option);
  });
}

function displayAssignments() {
  assignmentList.innerHTML = "";

  if (assignments.length === 0) {
    assignmentList.innerHTML = "<p>No upcoming assignments.</p>";
    return;
  }

  assignments.sort(function (first, second) {
    return new Date(first.dueDate) - new Date(second.dueDate);
  });

  assignments.forEach(function (assignment) {
    const assignmentElement = document.createElement("div");

    assignmentElement.className = "assignment-item";

    if (assignment.completed) {
      assignmentElement.classList.add("completed-assignment");
    }

    const titleElement = document.createElement("h4");
    titleElement.textContent = assignment.title;

    const classElement = document.createElement("p");
    classElement.textContent = `Class: ${assignment.className}`;

    const dueDateElement = document.createElement("p");
    dueDateElement.textContent =
      `Due: ${formatDate(assignment.dueDate)}`;

    const priorityElement = document.createElement("p");
    priorityElement.textContent =
      `Priority: ${assignment.priority}`;

    priorityElement.classList.add(
      `priority-${assignment.priority.toLowerCase()}`
    );

    const actionsElement = document.createElement("div");
    actionsElement.className = "assignment-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "complete-button";
    completeButton.textContent =
      assignment.completed ? "Mark Incomplete" : "Mark Complete";

    completeButton.addEventListener("click", function () {
      toggleAssignment(assignment.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "assignment-delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteAssignment(assignment.id);
    });

    actionsElement.appendChild(completeButton);
    actionsElement.appendChild(deleteButton);

    assignmentElement.appendChild(titleElement);
    assignmentElement.appendChild(classElement);
    assignmentElement.appendChild(dueDateElement);
    assignmentElement.appendChild(priorityElement);
    assignmentElement.appendChild(actionsElement);

    assignmentList.appendChild(assignmentElement);
  });
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

assignmentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("assignmentTitle").value;
  const selectedClass = assignmentClass.value;
  const dueDate = document.getElementById("assignmentDueDate").value;
  const priority = document.getElementById("assignmentPriority").value;

  const newAssignment = {
    id: Date.now(),
    title: title,
    className: selectedClass,
    dueDate: dueDate,
    priority: priority,
    completed: false
  };

  assignments.push(newAssignment);

  saveAssignments();
  displayAssignments();

  assignmentForm.reset();
});

function toggleAssignment(assignmentId) {
  assignments = assignments.map(function (assignment) {
    if (assignment.id === assignmentId) {
      assignment.completed = !assignment.completed;
    }

    return assignment;
  });

  saveAssignments();
  displayAssignments();
}

function deleteAssignment(assignmentId) {
  assignments = assignments.filter(function (assignment) {
    return assignment.id !== assignmentId;
  });

  saveAssignments();
  displayAssignments();
}

updateAssignmentClassOptions();
displayAssignments();
// for test part
const testForm = document.getElementById("testForm");
const testClass = document.getElementById("testClass");
const testList = document.getElementById("testList");

let tests = JSON.parse(localStorage.getItem("tests")) || [];

function saveTests() {
  localStorage.setItem("tests", JSON.stringify(tests));
}

function updateTestClassOptions() {
  testClass.innerHTML = '<option value="">Select a class</option>';

  classes.forEach(function (classItem) {
    const option = document.createElement("option");

    option.value = classItem.name;
    option.textContent = classItem.name;

    testClass.appendChild(option);
  });
}

function displayTests() {
  testList.innerHTML = "";

  if (tests.length === 0) {
    testList.innerHTML = "<p>No upcoming tests.</p>";
    return;
  }

  tests.sort(function (first, second) {
    return new Date(first.date) - new Date(second.date);
  });

  tests.forEach(function (test) {
    const testElement = document.createElement("div");
    testElement.className = "test-item";

    const titleElement = document.createElement("h4");
    titleElement.textContent = test.title;

    const classElement = document.createElement("p");
    classElement.textContent = `Class: ${test.className}`;

    const dateElement = document.createElement("p");
    dateElement.textContent = `Date: ${formatDate(test.date)}`;

    const topicsHeading = document.createElement("p");
    topicsHeading.textContent = "Study topics:";

    const topicList = document.createElement("ul");
    topicList.className = "topic-list";

    test.topics.forEach(function (topic, topicIndex) {
      const listItem = document.createElement("li");

      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = topic.completed;

      checkbox.addEventListener("change", function () {
        test.topics[topicIndex].completed = checkbox.checked;
        saveTests();
        displayTests();
      });

      const topicText = document.createElement("span");
      topicText.textContent = topic.name;

      label.appendChild(checkbox);
      label.appendChild(topicText);
      listItem.appendChild(label);
      topicList.appendChild(listItem);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "test-delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteTest(test.id);
    });

    testElement.appendChild(titleElement);
    testElement.appendChild(classElement);
    testElement.appendChild(dateElement);
    testElement.appendChild(topicsHeading);
    testElement.appendChild(topicList);
    testElement.appendChild(deleteButton);

    testList.appendChild(testElement);
  });
}

testForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("testTitle").value;
  const selectedClass = testClass.value;
  const date = document.getElementById("testDate").value;
  const topicsText = document.getElementById("testTopics").value;

  const topics = topicsText
    .split(",")
    .map(function (topic) {
      return {
        name: topic.trim(),
        completed: false
      };
    })
    .filter(function (topic) {
      return topic.name !== "";
    });

  const newTest = {
    id: Date.now(),
    title: title,
    className: selectedClass,
    date: date,
    topics: topics
  };

  tests.push(newTest);

  saveTests();
  displayTests();

  testForm.reset();
});

function deleteTest(testId) {
  tests = tests.filter(function (test) {
    return test.id !== testId;
  });

  saveTests();
  displayTests();
}

updateTestClassOptions();
displayTests();
// for dashboard part
function updateDashboard() {
  const totalClassesElement = document.getElementById("totalClasses");
  const pendingAssignmentsElement =
    document.getElementById("pendingAssignments");
  const upcomingTestsElement = document.getElementById("upcomingTests");
  const totalNotesElement = document.getElementById("totalNotes");

  const dashboardAssignments =
    document.getElementById("dashboardAssignments");
  const dashboardTests = document.getElementById("dashboardTests");

  const pendingAssignments = assignments.filter(function (assignment) {
    return !assignment.completed;
  });

  totalClassesElement.textContent = classes.length;
  pendingAssignmentsElement.textContent = pendingAssignments.length;
  upcomingTestsElement.textContent = tests.length;
  totalNotesElement.textContent = notes.length;

  dashboardAssignments.innerHTML = "";

  if (pendingAssignments.length === 0) {
    dashboardAssignments.innerHTML =
      "<p>No pending assignments.</p>";
  } else {
    pendingAssignments
      .slice(0, 5)
      .forEach(function (assignment) {
        const item = document.createElement("div");
        item.className = "overview-item";

        const title = document.createElement("strong");
        title.textContent = assignment.title;

        const details = document.createElement("span");
        details.textContent =
          `${assignment.className} • Due ${formatDate(assignment.dueDate)}`;

        item.appendChild(title);
        item.appendChild(details);
        dashboardAssignments.appendChild(item);
      });
  }

  dashboardTests.innerHTML = "";

  if (tests.length === 0) {
    dashboardTests.innerHTML = "<p>No upcoming tests.</p>";
  } else {
    tests.slice(0, 5).forEach(function (test) {
      const item = document.createElement("div");
      item.className = "overview-item";

      const title = document.createElement("strong");
      title.textContent = test.title;

      const details = document.createElement("span");
      details.textContent =
        `${test.className} • ${formatDate(test.date)}`;

      item.appendChild(title);
      item.appendChild(details);
      dashboardTests.appendChild(item);
    });
  }
}

updateDashboard();
