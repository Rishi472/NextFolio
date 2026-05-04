const EMPTY_RESUME_MESSAGE = "Please create your resume first to view portfolio";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("command-line-input");
  const output = document.getElementById("command-line-output");

  const getData = () => window.NEXTFOLIO_DATA || null;
  const hasData = (data) => {
    if (!data) return false;
    return Object.values(data).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (value && typeof value === "object") return hasData(value);
      return Boolean(value);
    });
  };

  const print = (content) => {
    output.textContent = content;
  };

  const commands = {
    help: () =>
      print(
        [
          "Available commands:",
          "show_resume",
          "show_projects",
          "show_skills",
          "show_contact",
          "clear",
        ].join("\n")
      ),
    clear: () => print(""),
    show_resume: (data) => print(JSON.stringify(data.resume || data, null, 2)),
    show_projects: (data) => print(JSON.stringify(data.projects || [], null, 2)),
    show_skills: (data) => print(JSON.stringify(data.skills || data.resume?.technical_skills || [], null, 2)),
    show_contact: (data) => {
      const personal = data.personal || data.resume?.contact || {};
      print(
        [
          data.name && `Name: ${data.name}`,
          personal.email && `Email: ${personal.email}`,
          personal.phone && `Phone: ${personal.phone}`,
        ]
          .filter(Boolean)
          .join("\n")
      );
    },
  };

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const command = input.value.trim().toLowerCase();
    input.value = "";

    if (!command) return;
    if (command === "help" || command === "hint") {
      commands.help();
      return;
    }
    if (command === "clear") {
      commands.clear();
      return;
    }

    const data = getData();
    if (!hasData(data)) {
      print(EMPTY_RESUME_MESSAGE);
      return;
    }

    if (commands[command]) {
      commands[command](data);
      return;
    }

    print(`Unknown command: ${command}`);
  });
});
