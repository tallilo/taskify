"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { useAction } from "@/app/hooks/use-action";
import { useProModal } from "@/app/hooks/use-pro-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  isPro: boolean;
}

export default function SubscriptionButton({ isPro }: SubscriptionButtonProps) {
  const proModal = useProModal();
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const onClick = () => {
    if (isPro) execute({});
    else proModal.onOpen;
  };
  return (
    <Button onClick={onClick} disabled={isLoading} variant="primary">
      {isPro ? "Manage subscription" : "Upgrade to pro"}
    </Button>
  );
}
