export default function OffersPage() {
  return (
    <div className="space-y-6">
      <h1 className="section-title">Ofertas</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="card" key={i}>
            <div className="card-body">
              <div className="font-medium">Serviço #{i + 1}</div>
              <div className="text-sm opacity-70">Prestador Exemplo</div>
              <div className="mt-2 text-right">
                <span className="font-semibold">R$ {(30 + i * 5).toFixed(2)}</span>
                <span className="text-xs opacity-70 ml-1">/hora</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
