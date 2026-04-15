import * as pdfjsLib from "../../node_modules/pdfjs-dist/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "../../node_modules/pdfjs-dist/build/pdf.worker.mjs";

const state = {
  document: null,
  pageNumber: 1,
  scale: 1,
  fileName: null,
};

const elements = {
  openPdf: document.querySelector("#open-pdf"),
  documentTitle: document.querySelector("#document-title"),
  emptyState: document.querySelector("#empty-state"),
  canvas: document.querySelector("#pdf-canvas"),
  prevPage: document.querySelector("#prev-page"),
  nextPage: document.querySelector("#next-page"),
  zoomIn: document.querySelector("#zoom-in"),
  zoomOut: document.querySelector("#zoom-out"),
  pageStatus: document.querySelector("#page-status"),
  zoomStatus: document.querySelector("#zoom-status"),
};

function setViewerMessage(message) {
  elements.emptyState.style.display = "grid";
  elements.emptyState.querySelector("p").textContent = message;
  elements.canvas.style.display = "none";
}

function updateControls() {
  const hasDocument = Boolean(state.document);
  const pageCount = state.document?.numPages || 0;
  elements.prevPage.disabled = !hasDocument || state.pageNumber <= 1;
  elements.nextPage.disabled = !hasDocument || state.pageNumber >= pageCount;
  elements.zoomOut.disabled = !hasDocument || state.scale <= 0.75;
  elements.zoomIn.disabled = !hasDocument || state.scale >= 2;
  elements.pageStatus.textContent = `${hasDocument ? state.pageNumber : 0} / ${pageCount}`;
  elements.zoomStatus.textContent = `${Math.round(state.scale * 100)}%`;
}

async function renderCurrentPage() {
  if (!state.document) return;

  const page = await state.document.getPage(state.pageNumber);
  const viewport = page.getViewport({ scale: state.scale });
  const context = elements.canvas.getContext("2d");

  elements.canvas.width = Math.floor(viewport.width);
  elements.canvas.height = Math.floor(viewport.height);
  elements.canvas.style.display = "block";
  elements.emptyState.style.display = "none";

  await page.render({ canvasContext: context, viewport }).promise;
  updateControls();
}

async function openPdf() {
  const result = await window.gateway.openPdfFile();
  if (result.canceled) return;

  try {
    setViewerMessage("PDF를 여는 중입니다.");
    const data = new Uint8Array(result.bytes);
    state.document = await pdfjsLib.getDocument({ data }).promise;
    state.pageNumber = 1;
    state.scale = 1;
    state.fileName = result.fileName;
    elements.documentTitle.textContent = result.fileName;
    await renderCurrentPage();
  } catch (error) {
    state.document = null;
    state.pageNumber = 1;
    state.fileName = null;
    elements.documentTitle.textContent = "열 수 없는 PDF";
    setViewerMessage(error?.message || "PDF를 열 수 없습니다.");
    updateControls();
  }
}

async function boot() {
  const info = await window.gateway.getAppInfo();
  document.querySelector("#app-name").textContent = info.name;
  document.querySelector("#app-version").textContent = info.version;
  document.querySelector("#app-platform").textContent = info.platform;
  document.querySelector("#app-build").textContent = info.buildTime;
  elements.openPdf.addEventListener("click", openPdf);
  elements.prevPage.addEventListener("click", async () => {
    state.pageNumber -= 1;
    await renderCurrentPage();
  });
  elements.nextPage.addEventListener("click", async () => {
    state.pageNumber += 1;
    await renderCurrentPage();
  });
  elements.zoomOut.addEventListener("click", async () => {
    state.scale = Math.max(0.75, state.scale - 0.25);
    await renderCurrentPage();
  });
  elements.zoomIn.addEventListener("click", async () => {
    state.scale = Math.min(2, state.scale + 0.25);
    await renderCurrentPage();
  });
  updateControls();
}

boot().catch((error) => {
  document.querySelector("#app-name").textContent = "초기화 실패";
  document.querySelector("#app-build").textContent = error.message;
});
