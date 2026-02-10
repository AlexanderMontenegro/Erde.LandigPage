export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-bold text-neon-green mb-6">¡Pago Exitoso!</h1>
        <p className="text-xl text-text-muted mb-8">
          Gracias por tu compra. Pronto recibirás tu pedido personalizado.
        </p>
        <a href="/" className="btn btn-primary px-10 py-5 text-xl font-bold">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}