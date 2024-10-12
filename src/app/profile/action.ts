const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const getProfile = async (token: string) => {
  const response = await fetch(`${url}/api/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil profil");
  }

  const data = await response.json();

  return data;
};
