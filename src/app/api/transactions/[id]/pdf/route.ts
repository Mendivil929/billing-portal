import { ApiError, apiRequest, readApiError } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { getActiveCostCenter } from "@/lib/cost-center";

function errorResponse(status: number) {
  return Response.json({ status }, { status });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return errorResponse(400);

  const [session, costCenter] = await Promise.all([getSession(), getActiveCostCenter()]);
  if (!session) return errorResponse(401);
  if (!costCenter) return errorResponse(403);

  try {
    const response = await apiRequest(`/api/v1/accounts-receivable/transactions/${id}/pdf`, {
      token: session.token,
      headers: { "X-Cost-Center-Id": costCenter.id },
    });
    if (!response.ok) return errorResponse((await readApiError(response)).status);

    return new Response(response.body, {
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/pdf",
        "Content-Disposition":
          response.headers.get("content-disposition") ?? `inline; filename="${id}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return errorResponse(error instanceof ApiError ? error.status : 502);
  }
}
