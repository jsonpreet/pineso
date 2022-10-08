import html2canvas from "html2canvas";

export async function exportPNG({ rootRef }) {
    if (rootRef.current !== undefined) {
      const canvas = await html2canvas(rootRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 3,
        backgroundColor: null,
      });
      const img = canvas.toDataURL("image/png", 1.0);

      const a = document.createElement("a");
      a.href = img;
      a.download = "pineso.png";
      a.click();
      a.remove();
    }
}