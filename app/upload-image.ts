"use client";

const MAX_SOURCE_FILE_SIZE = 20 * 1024 * 1024;
const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024;
const MOBILE_IMAGE_EXTENSION = /\.(?:avif|heic|heif|jpe?g|png|webp)$/i;

type OptimizedImage = { dataUrl: string; file: File };

function optimizedImage(file: File): Promise<OptimizedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => reject(new Error("Formato não compatível. No celular, escolha JPG, PNG ou WEBP."));
      image.onload = () => {
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) return reject(new Error("Não foi possível processar a imagem."));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Não foi possível processar a imagem."));
          if (blob.size > MAX_UPLOAD_FILE_SIZE) return reject(new Error("A imagem ficou grande demais após a otimização."));
          const baseName = file.name.replace(/\.[^.]+$/, "") || "foto";
          const optimizedFile = new File([blob], `${baseName}.webp`, { type: "image/webp" });
          const dataUrlReader = new FileReader();
          dataUrlReader.onerror = () => reject(new Error("Não foi possível preparar a imagem."));
          dataUrlReader.onload = () => resolve({ dataUrl: String(dataUrlReader.result), file: optimizedFile });
          dataUrlReader.readAsDataURL(blob);
        }, "image/webp", 0.82);
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File) {
  if (!file.type.startsWith("image/") && !MOBILE_IMAGE_EXTENSION.test(file.name)) {
    throw new Error("Selecione um arquivo de imagem.");
  }
  if (file.size > MAX_SOURCE_FILE_SIZE) throw new Error("A foto original deve ter no máximo 20 MB.");

  const optimized = await optimizedImage(file);
  const formData = new FormData();
  formData.append("file", optimized.file);
  try {
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    if (response.ok) {
      const { url } = await response.json();
      return String(url);
    }
  } catch { /* usa a alternativa local abaixo */ }

  return optimized.dataUrl;
}
