import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import "./FabricDemo.css";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const FabricPDF = ({ pdfBlob }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#ffffff",
      selection: false,
      renderOnAddRemove: true,
    });

    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!pdfBlob || !fabricRef.current) return;

    const renderPdf = async () => {
      const canvas = fabricRef.current;

      const pdfBuffer = await pdfBlob.arrayBuffer();
      const pdf = await getDocument({ data: pdfBuffer }).promise;
      const page = await pdf.getPage(1);

      const dpi = window.devicePixelRatio || 1;
      const superScale = dpi * 4; // super sharp

      const viewport = page.getViewport({ scale: superScale });

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height + 300;

      const ctx = tempCanvas.getContext("2d");

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      const imgURL = tempCanvas.toDataURL("image/png");

      fabric.Image.fromURL(imgURL, (img) => {
        const containerWidth = containerRef.current.clientWidth;

        const displayScale = containerWidth / viewport.width;

        img.set({
          selectable: false,
          evented: false,
          scaleX: displayScale,
          scaleY: displayScale,
        });

        canvas.setDimensions({
          width: viewport.width * displayScale,
          height: viewport.height * displayScale,
        });

        canvas.clear();
        canvas.add(img);
        canvas.renderAll();
      });
    };

    renderPdf();
  }, [pdfBlob]);

  return (
    <div className="fabric-pdf-wrapper">
      <div className="fabric-pdf-container" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default FabricPDF;
