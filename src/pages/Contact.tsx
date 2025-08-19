import { useState } from "react";
import { sendSupportMessage } from "@/lib/api";

type Form = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const SUBJECTS = [
  { value: "", label: "Selecione o assunto" },
  { value: "duvida", label: "Dúvida sobre a plataforma" },
  { value: "pagamento", label: "Problema de pagamento" },
  { value: "cancelamento", label: "Cancelamento" },
  { value: "suporte", label: "Suporte técnico" },
  { value: "outro", label: "Outro" },
];

export default function ContactPage() {
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      alert("Preencha nome, e-mail, assunto e mensagem.");
      return;
    }
    setLoading(true);
    try {
      await sendSupportMessage(form); // POST para o back (se existir)
      alert("Mensagem enviada! Em breve entraremos em contato.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="mx-auto max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold">Entre em Contato</h1>
          <p className="opacity-70 mt-2">
            Estamos aqui para ajudar. Fale com a gente pelos canais abaixo.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FORM */}
          <form onSubmit={onSubmit} className="card">
            <div className="card-header">
              <div className="text-lg font-semibold">Envie sua Mensagem</div>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="label">Nome *</label>
                <input
                  className="input"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Telefone</label>
                  <input
                    className="input"
                    placeholder="(11) 99999-9999"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Assunto *</label>
                <select
                  className="select"
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Mensagem *</label>
                <textarea
                  className="input min-h-[140px]"
                  placeholder="Descreva sua dúvida ou solicitação…"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button className="btn btn-solid w-full sm:w-auto" disabled={loading}>
                  {loading ? "Enviando…" : "Enviar Mensagem"}
                </button>
              </div>
            </div>
          </form>

          {/* INFO / CONTATOS */}
          <aside className="space-y-6">
            <div className="card">
              <div className="card-header">
                <div className="text-lg font-semibold">Informações de Contato</div>
              </div>
              <div className="card-body space-y-3 text-sm">
                <div>
                  <div className="font-medium">Email</div>
                  <div className="opacity-80">contato@limpezaapp.com</div>
                  <div className="opacity-80">suporte@limpezaapp.com</div>
                </div>
                <div>
                  <div className="font-medium">Telefone</div>
                  <div className="opacity-80">(11) 9999-9999</div>
                  <div className="opacity-80">WhatsApp: (11) 88888-8888</div>
                </div>
                <div>
                  <div className="font-medium">Endereço</div>
                  <div className="opacity-80">
                    Rua das Flores, 123 – Vila Madalena, São Paulo - SP
                    <br />
                    CEP: 05014-020
                  </div>
                </div>
                <div>
                  <div className="font-medium">Horário de Atendimento</div>
                  <div className="opacity-80">Seg a Sex: 8h às 18h</div>
                  <div className="opacity-80">Sábado: 9h às 14h</div>
                  <div className="opacity-80">Domingo: Fechado</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="text-lg font-semibold">Contato Rápido</div>
              </div>
              <div className="card-body space-y-3">
                <a href="tel:+5511999999999" className="btn btn-outline w-full">
                  Ligar Agora
                </a>
                <a
                  href="https://wa.me/5511888888888"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline w-full"
                >
                  Enviar WhatsApp
                </a>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="text-lg font-semibold">Tempo de Resposta</div>
              </div>
              <div className="card-body text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-80">Email:</span>
                  <span className="font-medium">Até 24 horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Telefone:</span>
                  <span className="font-medium">Imediato</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">WhatsApp:</span>
                  <span className="font-medium">Até 2 horas</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
