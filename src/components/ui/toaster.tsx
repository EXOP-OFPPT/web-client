import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2Icon, CircleXIcon } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        variant,
        action,
        icon,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="w-full flex justify-center items-center">

              {
                variant === "default" ? (
                  <div className="w-1/5"><CheckCircle2Icon size={40} className="mr-2" /></div>
                ) : variant === "destructive" ? (
                  <div className="w-1/5"><CircleXIcon size={40} className="mr-2" /></div>
                ) :
                  null
              }
              {/* <div className="w-1/5">{icon && icon}</div> */}
              <div className="w-4/5 grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
