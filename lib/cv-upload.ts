export const MAX_CV_BYTES = 10 * 1024 * 1024;

export function cvContentType(filename: string): string | null {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf": return "application/pdf";
    case "doc": return "application/msword";
    case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default: return null;
  }
}
