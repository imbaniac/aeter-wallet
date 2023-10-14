import { useNavigate } from "@tanstack/react-router";
import { HDNodeWallet } from "ethers";

import { Button } from "@/components/ui/button";

export const Welcome = () => {
  const navigate = useNavigate();

  const handleNewWallet = () => {
    const mnemonic = HDNodeWallet.createRandom();

    // TODO: change to SQLite
    // FIXME: uncomment
    // localStorage.setItem("phrase", mnemonic.mnemonic?.phrase || "");
    localStorage.setItem(
      "phrase",
      "test test test test test test test test test test test junk"
    );

    navigate({ to: "/profile/new" });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-16 h-full">
      <h1 className="text-5xl font-bold">Welcome to Æter</h1>
      <section className="flex flex-col gap-4">
        <Button size="lg" className="w-full" onClick={handleNewWallet}>
          Continue with new wallet
        </Button>
        <Button variant="outline" size="lg" className="w-full">
          Import wallet
        </Button>
      </section>
    </div>
  );
};
