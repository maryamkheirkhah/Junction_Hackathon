const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(usernameOrEmail: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameOrEmail, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function getRecentTickets(limit: number = 5) {
  const response = await fetch(`${API_URL}/tickets?limit=${limit}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recent tickets");
  }

  return response.json();
}

export async function getTickets(page: number = 1, limit: number = 10, userId?: number) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/tickets`;
  const url = userId 
    ? `${baseUrl}/user/${userId}?page=${page}&limit=${limit}` 
    : `${baseUrl}?page=${page}&limit=${limit}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user.token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
}
