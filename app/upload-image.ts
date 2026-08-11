"use client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function optimizedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      image.onload = () => {
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) return reject(new Error("Não foi possível processar a imagem."));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Selecione um arquivo de imagem.");
  if (file.size > MAX_FILE_SIZE) throw new Error("A imagem deve ter no máximo 5 MB.");

  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    if (response.ok) {
      const { url } = await response.json();
      return String(url);
    }
  } catch { /* usa a alternativa local abaixo */ }

  return optimizedDataUrl(file);
}
