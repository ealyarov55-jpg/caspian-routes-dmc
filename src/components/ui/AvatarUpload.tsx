"use client";

import { useState, useRef, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { Camera, Loader } from "lucide-react";

interface AvatarUploadProps {
  uid: string;
  currentPhoto?: string;
  name: string;
  onUpload?: (url: string) => void;
}

export default function AvatarUpload({ uid, currentPhoto, name, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [photo, setPhoto] = useState(currentPhoto || "");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentPhoto) setPhoto(currentPhoto);
  }, [currentPhoto]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setProgress(0);

    const storageRef = ref(storage, `avatars/${uid}/profile.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await setDoc(doc(db, "providers", uid), { photoURL: url }, { merge: true });
        setPhoto(url);
        setUploading(false);
        onUpload?.(url);
      }
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%",
          background: photo ? "transparent" : "linear-gradient(135deg, #042e2e, #0a7070)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", border: "3px solid white",
          boxShadow: "0 4px 16px rgba(4,46,46,0.2)",
        }}>
          {photo ? (
            <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>{name ? name[0].toUpperCase() : "?"}</span>
          )}
        </div>

        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "rgba(2,26,26,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: uploading ? 1 : 0,
          transition: "opacity 0.2s",
        }}
          onMouseEnter={e => !uploading && (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => !uploading && (e.currentTarget.style.opacity = "0")}
        >
          {uploading ? (
            <Loader size={20} color="white" style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Camera size={20} color="white" />
          )}
        </div>
      </div>

      {uploading && (
        <div style={{ width: 96 }}>
          <div style={{ background: "#e2eded", borderRadius: 999, height: 4, overflow: "hidden" }}>
            <div style={{ background: "#0a7070", height: "100%", width: `${progress}%`, transition: "width 0.3s" }} />
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3a3", marginTop: 4 }}>{progress}%</p>
        </div>
      )}

      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        style={{ fontSize: 12, color: "#0a7070", background: "none", border: "none", cursor: "pointer", fontFamily: "DM Sans, sans-serif", textDecoration: "underline" }}>
        {uploading ? "Uploading..." : "Change photo"}
      </button>

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}