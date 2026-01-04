
// O preload permite expor APIs seguras para o frontend se necessário.
// Por enquanto, apenas garante a ponte de contexto básica.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    console.log(`${type}-version`, process.versions[type]);
  }
});
