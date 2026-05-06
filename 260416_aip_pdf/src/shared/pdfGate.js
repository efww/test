const PROTECTED_MARKERS = [
  "microsoftirm",
  "microsoft information protection",
  "azure information protection",
  "msip_labels",
  "protectedpdf",
  "purview",
];

function inspectPdfBytes({ fileName, bytes }) {
  const size = bytes.byteLength ?? bytes.length ?? 0;
  const prefix = Buffer.from(bytes.slice(0, Math.min(size, 8192))).toString("latin1");
  const header = prefix.slice(0, 16);
  const normalized = prefix.toLowerCase();

  if (!header.startsWith("%PDF-")) {
    return {
      kind: "unsupported",
      reason: "not_pdf_header",
      safeFileName: fileName,
      fileSize: size,
      blocked: true,
      message: "PDF 파일 헤더를 확인할 수 없습니다.",
    };
  }

  const marker = PROTECTED_MARKERS.find((value) => normalized.includes(value));
  if (marker) {
    return {
      kind: "protected_pdf_candidate",
      reason: `protected_marker:${marker}`,
      safeFileName: fileName,
      fileSize: size,
      blocked: true,
      message: "보호 PDF로 의심되어 1차 기술검증 앱에서는 열지 않습니다.",
    };
  }

  return {
    kind: "regular_pdf",
    reason: "pdf_header_ok",
    safeFileName: fileName,
    fileSize: size,
    blocked: false,
    message: "일반 PDF로 분류되었습니다.",
  };
}

module.exports = { PROTECTED_MARKERS, inspectPdfBytes };
