"use client"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function Avatar({ src, alt = "User", size = 40, onUpload }) {
  const [hover, setHover] = useState(false)

  const handleFileChange = event => {
    const file = event.target.files?.[0]
    if (file && onUpload) {
      onUpload(file)
    }
  }

  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{ width: size, height: size }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={src || `/placeholder.svg?height=${size}&width=${size}`}
        alt={alt}
        className="w-full h-full object-cover"
      />
      {onUpload && (
        <label
          htmlFor="avatar-upload"
          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        >
          <Plus className="text-white" size={size / 2} />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  )
}
