const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configura tu email de envío
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'elrincondeemily.erde@gmail.com',               // TU EMAIL
    pass: 'Celu4388'         // APP PASSWORD
  }
});

exports.sendOrderStatusEmail = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    if (newData.status === previousData.status) {
      return null;
    }

    const orderId = context.params.orderId;
    const userId = newData.userId;
    const status = newData.status;
    const total = newData.total || 0;
    const items = newData.items || [];
    const trackingNumber = newData.trackingNumber || 'No disponible';

    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    if (!userDoc.exists) return null;

    const user = userDoc.data();
    const emailTo = user.email;
    if (!emailTo) return null;

    let subject = '';
    let text = `Hola ${user.nombre || 'Cliente'},\n\n`;

    if (status === 'PAGO') {
      subject = `¡Pago confirmado! Orden #${orderId}`;
      text += `Tu pago ha sido confirmado.\n\n`;
      text += `Detalle de tu compra:\n`;
      items.forEach(item => {
        text += `- ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
      });
      text += `\nTotal: $${total.toLocaleString('es-AR')}\n`;
      text += `\nEstado actual: PAGO (en preparación)\n`;
      text += `\nPronto te avisaremos cuando esté en camino. ¡Gracias por tu compra!`;

    } else if (status === 'ENVIADO') {
      subject = `Tu orden #${orderId} ha sido enviada`;
      text += `Tu pedido ha sido despachado.\n\n`;
      text += `Detalle de tu compra:\n`;
      items.forEach(item => {
        text += `- ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
      });
      text += `\nTotal: $${total.toLocaleString('es-AR')}\n`;
      text += `\nEstado actual: ENVIADO\n`;
      text += `Número de seguimiento: ${trackingNumber}\n`;
      text += `\nPodés seguir tu envío en el link de la empresa de envíos.\n\n¡Ya está en camino!`;

    } else if (status === 'ENTREGADO') {
      subject = `¡Gracias por tu compra! Orden #${orderId} entregada`;
      text += `Tu pedido ha sido entregado con éxito.\n\n`;
      text += `Detalle de tu compra:\n`;
      items.forEach(item => {
        text += `- ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
      });
      text += `\nTotal: $${total.toLocaleString('es-AR')}\n`;
      text += `\nEstado actual: ENTREGADO\n\n`;
      text += `Como agradecimiento, te regalamos un 10% de descuento en tu próxima compra con el cupón:\n`;
      text += `**ERDE-DESCUENTO-10**\n\n`;
      text += `¡Esperamos verte pronto de nuevo!`;

    } else {
      return null;
    }

    const mailOptions = {
      from: 'ERDE Store <tuemail@gmail.com>',
      to: emailTo,
      subject,
      text
    };

    try {
      await transporter.sendMail(mailOptions);
      return null;
    } catch (error) {
      console.error('Error enviando email:', error);
      return null;
    }
  });