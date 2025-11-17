let editor = CodeMirror(document.getElementById("editor"), {
    value: `#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`,
    mode: "text/x-csrc",
    lineNumbers: true,
    theme: "default"
});

document.getElementById("run").onclick = async () => {
    const code = editor.getValue();

    const resp = await fetch("http://localhost:3000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
    });

    const data = await resp.json();
    document.getElementById("saida").textContent = data.output;
};
