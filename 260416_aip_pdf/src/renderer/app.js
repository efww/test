async function boot() {
  const info = await window.gateway.getAppInfo();
  document.querySelector("#app-name").textContent = info.name;
  document.querySelector("#app-version").textContent = info.version;
  document.querySelector("#app-platform").textContent = info.platform;
  document.querySelector("#app-build").textContent = info.buildTime;
}

boot().catch((error) => {
  document.querySelector("#app-name").textContent = "초기화 실패";
  document.querySelector("#app-build").textContent = error.message;
});
