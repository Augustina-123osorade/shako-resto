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


// // lib/cloudinary.ts
// export async function uploadImage(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await fetch("/api/upload", {
//     method: "POST",
//     body: formData,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.error || "Failed to upload image");
//   }

//   return data.url as string;
// }
