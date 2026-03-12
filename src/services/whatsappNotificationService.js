import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Servicio modular para enviar notificación por WhatsApp
export const sendWhatsAppNotification = async (order) => {
  try {
    // Obtener teléfono del cliente desde Firestore
    const userDoc = await getDoc(doc(db, 'users', order.userId));
    const user = userDoc.exists() ? userDoc.data() : {};
    const clientPhone = user.telefono?.replace(/\D/g, '') || '';

    if (!clientPhone) {
      alert('No se encontró número de teléfono del cliente.');
      return;
    }

    // Mensaje predefinido según tu ejemplo
    const message = `ERDE D&C Store
N° de Orden: ${order.id}
N° Id Interno: ${order.internalOrderId || 'N/A'}

Detalles de compra:
${order.items ? order.items.map(item => `${item.quantity}x ${item.name}`).join('\n') : ''}

Total de la Compra: $${order.total?.toLocaleString('es-AR') || 'N/A'}

Estado: ${order.status}

Referencia de envio: ${order.trackingNumber || 'Pendiente de asignar'}`;

    const whatsappLink = `https://wa.me/${clientPhone}?text=${encodeURIComponent(message)}`;

    // Abre WhatsApp con el mensaje listo
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');

  } catch (error) {
    console.error('Error al generar notificación WhatsApp:', error);
    alert('No se pudo abrir WhatsApp. Verifica los datos del cliente.');
  }
};