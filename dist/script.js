(() => {
  const files = ["app-core.js", "app-render.js", "app-main.js"];

  const loadNext = (index) => {
    if (index >= files.length) {
      return;
    }

    const script = document.createElement("script");
    script.src = files[index];
    script.onload = () => loadNext(index + 1);
    document.body.appendChild(script);
  };

  loadNext(0);
})();
