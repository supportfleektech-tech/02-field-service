# OpenAPI — Field Service OS (v1)
Base: /api/v1 · auth: x-org-id + x-dev-user-email (dev) / Bearer (prod)
- GET /health
- GET|POST /work-orders — {customerId,title,description?,priority?,scheduledAt?}
- POST /work-orders/:id/dispatch — {technicianId?}
- POST /work-orders/:id/complete
- GET|POST /technicians — {name,phone?,specialization?}
- GET|POST /service-reports — {workOrderId,summary,signatureB64?,gpsLat?,gpsLng?,photoUrls?[]}
- POST /webhooks/mpesa
