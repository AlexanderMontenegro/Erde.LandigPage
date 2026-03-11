// src/services/whatsappService.js
export const generateWhatsAppNotification = (order, cartItems, totalAmount, user) => {
  if (!user || !user.telefono) {
    alert('No se encontró teléfono registrado del cliente para notificar.');
    return null;
  }

  const phone = user.telefono.replace(/\D/g, ''); // Limpia número (solo dígitos)
  const internalOrderId = order.internalOrderId || order.id || 'N/A';
  const status = order.status || 'PENDIENTE';
  const total = totalAmount ? `$${Number(totalAmount).toLocaleString('es-AR')}` : 'N/A';

  // Detalle de productos
  const itemsText = cartItems.length > 0 
    ? cartItems.map(item => 
        `${item.quantity}x ${item.name} - $${(Number(item.basePrice) * Number(item.quantity)).toLocaleString('es-AR')}`
      ).join('\n')
    : 'Sin detalles disponibles';

  let message = `ERDE D&C Store\n\n`;
  message += `Cliente: ${user.nombre || 'Cliente'} ${user.apellido || ''}\n`;
  message += `Orden: ${internalOrderId}\n`;
  message += `Estado actual: ${status}\n\n`;
  message += `Detalle de la compra:\n${itemsText}\n`;
  message += `Total: ${total}\n\n`;

  if (order.trackingNumber) {
    message += `Número de seguimiento: ${order.trackingNumber}\n`;
  }

  message += `Gracias por tu compra. ¡Estamos a tu disposición!`;

  const whatsappLink = `https://wa.me/549${phone}?text=${encodeURIComponent(message)}`;

  return whatsappLink;
};