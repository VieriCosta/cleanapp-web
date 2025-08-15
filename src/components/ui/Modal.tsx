import { ReactNode } from "react";

export default function Modal({
  open, onClose, title, children, footer,
}: { open: boolean; onClose: () => void; title?: string; children: ReactNode; footer?: ReactNode; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-2">
      <div className="w-full sm:max-w-lg rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xl">
        <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="font-medium">{title}</div>
          <button onClick={onClose} className="px-2 py-1 text-sm opacity-70 hover:opacity-100">Fechar</button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-black/10 dark:border-white/10 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
