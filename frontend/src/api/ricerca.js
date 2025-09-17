const BASE_URL = "http://localhost:3000/api";

export async function getListaSanitariRicerca() {
    const res = await fetch(`${BASE_URL}/ricerca/lista-sanitari`);
    
    if(!res.ok) throw new Error("Errore nella lista saniari: ");

    return res.json();
}

export async function getRicerca(query) {
  const params = new URLSearchParams();
  if (query?.spec) params.set("spec", query.spec);
  if (query?.citta) params.set("citta", query.citta);
  if (query?.modalita) params.set("modalita", query.modalita);

  const url = `${BASE_URL}/ricerca?${params.toString()}`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Errore nel get della ricerca");
  return res.json();
}