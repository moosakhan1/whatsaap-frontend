export async function findMessage(token, obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/findMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },
    body: JSON.stringify(obj),
  });
}
export async function sendMessage(token, obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/SendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },
    body: JSON.stringify(obj),
  });
}
export async function allowNotification(token, obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/allowNotification`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },
    body: JSON.stringify(obj),
  });
}
export async function sendVideos(obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sendVideos`, {
    method: "POST",
    body: obj,
  });
}
export async function sendVideosMessage(obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sendVideoMessage`, {
    method: "POST",
    body: obj,
  });
}
