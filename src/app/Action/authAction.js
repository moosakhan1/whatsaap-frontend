import { redirect } from "next/navigation";

export async function signIn(obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/SignIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
}
export async function signUp(obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/SignUp`, {
    method: "POST",
    body: obj,
  });
}
export async function Verify(obj) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
}
export async function editeProfile(obj, token) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editeProfile`, {
    method: "POST",
    headers: { token: token },
    body: obj,
  });
}
export async function editeDetaile(obj, token) {
  return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editeDetails`, {
    method: "POST",
    headers: { token: token },
    body: obj,
  });
}
