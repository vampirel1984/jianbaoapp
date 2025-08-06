"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../cropImageHelper"; // 这里路径根据实际调整

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 裁剪相关状态
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);
    const totalFiles = files.length + selectedFiles.length;

    if (totalFiles > 3) {
      alert("最多只能上传 3 张图片");
      return;
    }

    // 只针对拍照上传做裁剪，图库直接添加（这里用id区分也行）
    if (e.target.id === "camera-upload" && selectedFiles.length > 0) {
      // 拍照只处理第一张，弹出裁剪界面
      const file = selectedFiles[0];
      const url = URL.createObjectURL(file);
      setCroppingImage(url);
      setCroppingFile(file);
      e.target.value = "";
      return;
    }

    // 图库上传，直接添加文件
    setFiles(prev => [...prev, ...selectedFiles]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  async function handleCropConfirm() {
    if (!croppingImage || !croppedAreaPixels || !croppingFile) return;

    try {
      const croppedBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], croppingFile.name, {
        type: croppingFile.type,
      });

      // 添加裁剪后的图片，如果超出3张，则提示
      if (files.length >= 3) {
        alert("最多只能上传3张图片");
      } else {
        setFiles(prev => [...prev, croppedFile]);
      }
    } catch (error) {
      alert("裁剪图片失败，请重试");
    } finally {
      // 关闭裁剪界面
      setCroppingImage(null);
      setCroppingFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  }

  async function handleUpload() {
    if (files.length === 0) {
      alert("请先选择或拍摄图片！");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://192.168.1.105:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("服务器响应失败");

      const data = await res.json();
      setResult(data.result || "未获取到分析结果");
    } catch (err: any) {
      setResult("上传失败：" + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat p-6 flex flex-col items-center"
      style={{ backgroundImage: "url('/123.jpg')" }}
    >
      <h1 className="text-white text-3xl font-extrabold mb-6 drop-shadow-lg">
        鉴宝 App — 上传鉴定
      </h1>

      <p className="text-white mb-4 text-center opacity-80">
        最多上传 <strong>3 张</strong> 文物图片，可拍照或选择图库
      </p>

      <div className="flex gap-4 mb-4">
        <label
          htmlFor="camera-upload"
          className={`cursor-pointer ${
            files.length >= 3 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-pink-100"
          } text-pink-600 font-semibold py-2 px-4 rounded-lg shadow-lg transition`}
        >
          📷 拍照上传
        </label>
        <input
          id="camera-upload"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
          disabled={files.length >= 3}
        />

        <label
          htmlFor="gallery-upload"
          className={`cursor-pointer ${
            files.length >= 3 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-pink-100"
          } text-pink-600 font-semibold py-2 px-4 rounded-lg shadow-lg transition`}
        >
          🖼️ 从图库选择
        </label>
        <input
          id="gallery-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={files.length >= 3}
        />
      </div>

      {/* 裁剪弹窗 */}
      {croppingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-lg h-[400px] bg-white rounded-lg overflow-hidden">
            <Cropper
              image={croppingImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="horizontal-cover"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
              onClick={handleCropConfirm}
            >
              确认裁剪
            </button>
            <button
              className="bg-gray-400 text-black px-6 py-2 rounded shadow hover:bg-gray-500"
              onClick={() => setCroppingImage(null)}
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mt-4">
        {files.length === 0 && (
          <p className="col-span-3 text-white text-center opacity-80">
            暂未上传，请选择或拍照上传文物图像
          </p>
        )}

        {files.map((file, idx) => (
          <div
            key={idx}
            className="relative aspect-square w-full bg-white rounded overflow-hidden shadow border-2 border-blue-500"
            style={{ minHeight: "100px" }}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`upload-${idx}`}
              className="absolute inset-0 w-full h-full object-cover block"
            />
            <button
              onClick={() => removeFile(idx)}
              title="删除这张图片"
              className="absolute top-1 right-1 w-8 h-8 bg-red-600 text-white border-2 border-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        className={`mt-6 px-8 py-3 rounded-lg font-semibold text-white shadow-md transition ${
          loading || files.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
        onClick={handleUpload}
        disabled={loading || files.length === 0}
      >
        {loading ? "正在鉴定中..." : "📤 上传鉴定"}
      </button>

      <div className="bg-yellow-300 text-black p-4 mt-4 rounded">Tailwind OK ✅</div>

      {result && (
        <div className="mt-6 bg-white text-gray-800 p-4 rounded-lg shadow-md max-w-md whitespace-pre-wrap">
          <h2 className="text-lg font-bold mb-2">鉴定结果：</h2>
          {result}
        </div>
      )}
    </div>
  );
}
