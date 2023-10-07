import { Button } from "@/components/ui/button";
import { NewProfile } from "@/pages/NewProfile";

import { HDNodeWallet } from "ethers";
import { useState } from "react";

const createMnemonicAccounts = (num: number) => {
  const mnemonic = HDNodeWallet.createRandom();

  localStorage.setItem("phrase", mnemonic.mnemonic?.phrase || "");
  const accounts = [];

  for (let i = 0; i < num; i++) {
    accounts.push(mnemonic.deriveChild(i));
  }

  return accounts;
};

export const Welcome = () => {
  const [accounts, setAccounts] = useState<HDNodeWallet[]>([]);

  const handleNewWallet = () => {
    const accounts = createMnemonicAccounts(5);
    setAccounts(accounts);
  };

  return accounts.length ? (
    <NewProfile accounts={accounts} />
  ) : (
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
