import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type FeedbackKind = "success" | "error" | "info";

interface AlertBannerProps {
      kind: FeedbackKind;
      message: string;
      onClose?: () => void;
      className?: string;
}

const STYLES: Record<FeedbackKind, string> = {
      success: "bg-green-50 border-green-200 text-green-700",
      error: "bg-red-50 border-red-200 text-red-700",
      info: "bg-blue-50 border-blue-200 text-blue-700",
};

const ICONS = {
      success: CheckCircle2,
      error: AlertCircle,
      info: Info,
};

const AlertBanner = ({ kind, message, onClose, className = "" }: AlertBannerProps) => {
      const Icon = ICONS[kind];

      return (
            <div
                  role={kind === "error" ? "alert" : "status"}
                  className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${STYLES[kind]} ${className}`}
            >
                  <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 shrink-0" />
                        <p className="font-medium">{message}</p>
                  </div>

                  {onClose && (
                        <button
                              type="button"
                              onClick={onClose}
                              aria-label="Fermer le message"
                              className="cursor-pointer"
                        >
                              <X className="w-4 h-4" />
                        </button>
                  )}
            </div>
      );
};

export default AlertBanner;
