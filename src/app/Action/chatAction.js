export async function findChats(token, email) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/findChats`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },
    body: JSON.stringify({ Useremail: email }),
  });
}
export async function addChat(token, obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/addUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },
    body: JSON.stringify(obj),
  });
}
export async function blockedChat(token, obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blockedChat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },
    body: JSON.stringify(obj),
  });
}
export async function unblockedChat(token, obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/unblockedChat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },
    body: JSON.stringify(obj),
  });
}
