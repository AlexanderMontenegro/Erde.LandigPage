// src/services/whatsappService.js
export const sendStatusNotification = (order, clientPhone) => {
  if (!clientPhone) {
    alert('No se encontró teléfono del cliente. No se puede enviar notificación.');
    return;
  }

  const detail = order.items
    ? order.items.map(item => `${item.quantity}x ${item.name}`).join('\n')
    : 'Sin detalle';

  const message = `ERDE D&C Store

Orden ID: ${order.internalOrderId || order.id}
Estado: ${order.status}

Detalle de la compra:
${detail}

Total: $${order.total?.toLocaleString('es-AR') || '0'}

${order.trackingNumber ? `N° de seguimiento: ${order.trackingNumber}` : ''}

A confirmar pago. Gracias por elegirnos!`;

  const whatsappLink = `https://wa.me/${clientPhone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappLink, '_blank', 'noopener,noreferrer');
};