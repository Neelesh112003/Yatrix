// frontend/lib/generatePDF.ts
// Generates and downloads itinerary as clean, sober PDF using browser print API

interface SlotData {
  place: string;
  activity: string;
  duration: string;
  estimatedCost: number;
}

interface DayPlan {
  day: number;
  title: string;
  tip: string;
  morning: SlotData;
  afternoon: SlotData;
  evening: SlotData;
}

interface TripData {
  city: string;
  fromCity?: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  travelers: number;
  tripType: string;
  selectedTrain?: any;
  selectedHotel?: any;
  selectedTransport?: any;
  estimatedCost?: number;
  itinerary: DayPlan[];
}

export const generateItineraryPDF = (trip: TripData, bookingRef?: string) => {
  const startDate = new Date(trip.startDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const endDate = new Date(trip.endDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const escapeHtml = (value?: string | number) =>
    String(value ?? "—")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const slotBlock = (label: string, data?: SlotData) => `
    <div style="padding:12px 0;border-top:1px solid #e5e7eb;page-break-inside:avoid;">
      <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;">
        <div style="min-width:110px;font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#6b7280;">
          ${escapeHtml(label)}
        </div>
        <div style="flex:1;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#111827;">
            ${escapeHtml(data?.place || "—")}
          </p>
          <p style="margin:0 0 6px;font-size:12px;line-height:1.55;color:#374151;">
            ${escapeHtml(data?.activity || "—")}
          </p>
          <p style="margin:0;font-size:11px;color:#6b7280;">
            Duration: <strong style="color:#111827;">${escapeHtml(data?.duration || "—")}</strong>
            &nbsp;&nbsp;•&nbsp;&nbsp;
            Cost: <strong style="color:#111827;">${
              data?.estimatedCost === 0
                ? "Free"
                : `₹${escapeHtml(data?.estimatedCost ?? "—")}`
            }</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  const daysHtml = trip.itinerary
    .map(
      (day) => `
      <section style="margin-bottom:20px;border:1px solid #d1d5db;page-break-inside:avoid;">
        <div style="padding:14px 16px;border-bottom:1px solid #d1d5db;background:#f9fafb;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">
            Day ${escapeHtml(day.day)} of ${escapeHtml(trip.numberOfDays)}
          </p>
          <h3 style="margin:6px 0 0;font-size:18px;line-height:1.3;font-weight:700;color:#111827;">
            ${escapeHtml(day.title)}
          </h3>
          ${
            day.tip
              ? `<p style="margin:6px 0 0;font-size:11px;line-height:1.5;color:#6b7280;">Tip: ${escapeHtml(day.tip)}</p>`
              : ""
          }
        </div>

        <div style="padding:0 16px 4px;">
          ${slotBlock("Morning", day.morning)}
          ${slotBlock("Afternoon", day.afternoon)}
          ${slotBlock("Evening", day.evening)}
        </div>
      </section>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Yatrix — ${escapeHtml(trip.city)} Itinerary</title>
      <style>
        * {
          box-sizing: border-box;
        }

        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          background: #ffffff;
          color: #111827;
          font-size: 12px;
          line-height: 1.5;
          padding: 0;
        }

        @page {
          size: A4;
          margin: 18mm;
        }

        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <header style="margin-bottom:24px;padding-bottom:14px;border-bottom:2px solid #111827;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
          Yatrix Travel Itinerary
        </p>
        <h1 style="margin:0;font-size:30px;line-height:1.15;font-weight:700;color:#111827;">
          ${escapeHtml(trip.city)}
        </h1>
        <p style="margin:8px 0 0;font-size:12px;color:#4b5563;">
          ${escapeHtml(startDate)} to ${escapeHtml(endDate)}
        </p>
      </header>

      <section style="margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;border:1px solid #d1d5db;">
          <tr>
            <td style="width:25%;padding:10px 12px;border-right:1px solid #d1d5db;border-bottom:1px solid #d1d5db;background:#f9fafb;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">From</p>
              <p style="margin:0;font-size:12px;font-weight:600;color:#111827;">${escapeHtml(
  trip.fromCity || trip.selectedTrain?.fromCity || "—"
)}</p>
            </td>
            <td style="width:25%;padding:10px 12px;border-right:1px solid #d1d5db;border-bottom:1px solid #d1d5db;background:#f9fafb;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">Duration</p>
              <p style="margin:0;font-size:12px;font-weight:600;color:#111827;">${escapeHtml(trip.numberOfDays)} day(s)</p>
            </td>
            <td style="width:25%;padding:10px 12px;border-right:1px solid #d1d5db;border-bottom:1px solid #d1d5db;background:#f9fafb;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">Travelers</p>
              <p style="margin:0;font-size:12px;font-weight:600;color:#111827;">${escapeHtml(trip.travelers)}</p>
            </td>
            <td style="width:25%;padding:10px 12px;border-bottom:1px solid #d1d5db;background:#f9fafb;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">Trip Type</p>
              <p style="margin:0;font-size:12px;font-weight:600;color:#111827;">${escapeHtml(trip.tripType)}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding:10px 12px;border-right:1px solid #d1d5db;background:#fff;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">Train</p>
              <p style="margin:0;font-size:12px;color:#111827;">
                ${
                  trip.selectedTrain
                    ? `${escapeHtml(trip.selectedTrain.name)}${trip.selectedTrain.selectedClass ? ` (${escapeHtml(trip.selectedTrain.selectedClass)})` : ""}`
                    : "—"
                }
              </p>
            </td>
            <td colspan="2" style="padding:10px 12px;background:#fff;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">Hotel</p>
              <p style="margin:0;font-size:12px;color:#111827;">
                ${trip.selectedHotel ? escapeHtml(trip.selectedHotel.name) : "—"}
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding:10px 12px;border-top:1px solid #d1d5db;border-right:1px solid #d1d5db;background:#fff;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">Transport</p>
              <p style="margin:0;font-size:12px;color:#111827;">
                ${trip.selectedTransport ? escapeHtml(trip.selectedTransport.type) : "—"}
              </p>
            </td>
            <td colspan="2" style="padding:10px 12px;border-top:1px solid #d1d5db;background:#fff;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">Estimated Budget</p>
              <p style="margin:0;font-size:12px;font-weight:600;color:#111827;">
                ${trip.estimatedCost ? `₹${trip.estimatedCost.toLocaleString()}` : "—"}
              </p>
            </td>
          </tr>
        </table>
      </section>

      <section style="margin-bottom:18px;">
        <h2 style="margin:0 0 12px;font-size:18px;font-weight:700;color:#111827;">
          Day-wise Itinerary
        </h2>
      </section>

      ${daysHtml}

      ${
        bookingRef
          ? `
        <section style="margin-top:28px;padding-top:14px;border-top:1px solid #d1d5db;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">
            Booking Reference
          </p>
          <p style="margin:0;font-size:16px;font-weight:700;color:#111827;">
            ${escapeHtml(bookingRef)}
          </p>
        </section>
      `
          : ""
      }

      <footer style="margin-top:28px;padding-top:12px;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:11px;color:#6b7280;">
          Yatrix — Smart Travel Planning
        </p>
      </footer>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to download your itinerary.");
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};