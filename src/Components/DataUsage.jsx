import React from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import Footer from "./Footer";

const DataUsage = () => {
  const navigate = useNavigate();

  const navItem = (label, value = "", route) => (
    <div
      onClick={() => route && navigate(route)}
      className="flex justify-between items-center py-4 px-4 border-b border-gray-300 dark:border-gray-700 cursor-pointer bg-white dark:bg-neutral-800"
    >
      <span className="text-black dark:text-white">{label}</span>
      <span className="text-gray-500">{value && `${value} >`}</span>
    </div>
  );

  const sectionHeader = (title) => (
    <div className="text-xs text-gray-500 px-4 pt-4 pb-1 font-medium">
      {title}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-black text-black dark:text-white text-sm space-y-4">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-300 dark:border-gray-700 relative bg-gray-300 dark:bg-neutral-800">
        <MdChevronLeft
          onClick={() => navigate(-1)}
          className="text-3xl absolute left-4 cursor-pointer"
        />
        <h2 className="text-lg font-bold text-center w-full">Storage and data</h2>
      </div>

      {/* STORAGE */}
      <div className="space-y-1">
        {sectionHeader("Storage")}
        <div className="rounded-lg overflow-hidden">{navItem("Manage storage", "", "/data/manage-storage")}</div>
      </div>

      {/* NETWORK */}
      <div className="space-y-1">
        {sectionHeader("Network")}
        <div className="rounded-lg overflow-hidden">
          {navItem("Network usage", "", "/data/network-usage")}
          <div className="flex justify-between items-center px-4 py-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800">
            <span className="text-black dark:text-white">Use less data for calls</span>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          {navItem("Proxy", "", "/data/proxy")}
        </div>
      </div>

      {/* MEDIA QUALITY */}
      <div className="space-y-1">
        {sectionHeader("Media quality")}
        <div className="rounded-lg overflow-hidden">
          {navItem("Media upload quality", "Standard", "/data/media-upload-quality")}
        </div>
      </div>

      {/* AUTO DOWNLOAD */}
      <div className="space-y-1">
        {sectionHeader("Media auto-download")}
        <div className="rounded-lg overflow-hidden">
          {navItem("Photos", "Wi-Fi and cellular", "/data/photos-download")}
          {navItem("Audio", "Wi-Fi", "/data/audio-download")}
          {navItem("Video", "Wi-Fi", "/data/video-download")}
          {navItem("Documents", "Wi-Fi", "/data/documents-download")}
          {navItem("Reset auto-download settings", "", "/data/reset-download")}
        </div>
        <p className="px-4 pt-2 text-gray-500 text-xs">
          Voice Messages are always automatically downloaded.
        </p>
      </div>                                                                                                                                                              
      <Footer />
    </div>
  );
};

export default DataUsage;
