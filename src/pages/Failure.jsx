export default function Failure() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-bold text-red-500 mb-6">Pago Fallido</h1>
        <p className="text-xl text-text-muted mb-8">
          Algo salió mal con el pago. Intenta de nuevo o contactanos por WhatsApp.
        </p>
        <a href="/" className="btn btn-primary px-10 py-5 text-xl font-bold">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}