export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "restoshako"); // your preset

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/duk83cotj/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await res.json();
  console.log("Cloudinary response:", data); // ✅ full object
  return data.secure_url; // ✅ return only the image URL
}


