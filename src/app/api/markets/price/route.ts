import { getAssetPrice } from "@/services/marketService";

/**
 * Prix instantané d'un actif de l'univers : `GET /api/markets/price?id=bitcoin`.
 * Consommé toutes les 5 s par le mode live du graphique — jamais mis en cache.
 */
export async function GET(request: Request) {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
        return Response.json({ error: "missing id" }, { status: 400 });
    }

    const quote = await getAssetPrice(id);
    if (!quote) {
        return Response.json({ error: "unknown asset" }, { status: 404 });
    }

    return Response.json({ ...quote, t: Date.now() });
}
