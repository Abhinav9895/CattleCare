export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export async function predictDisease(file: File, symptoms: string) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("symptoms", symptoms)

  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  })

  return res.json()
}
