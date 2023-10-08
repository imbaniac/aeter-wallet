import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

import { Badge } from "@/components/ui/badge";
import { cn, truncateEthAddress } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Profile = {
  id: string;
  name: string;
  network: string;
  address: string;
};

export const Wallet = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile>();

  const [unlisteners, setUnlisteners] = useState<{
    unlistenEvent: () => void;
  }>();

  useEffect(() => {
    const profilesStringified = localStorage.getItem("profiles") || "";
    const savedProfiles = JSON.parse(profilesStringified);
    setProfiles(savedProfiles);
    setActiveProfile(savedProfiles[0]);

    return () => {
      unlisteners?.unlistenEvent();
    };
  }, []);

  const handleNewProfile = async () => {
    await invoke("open_new_profile_window");

    const unlisten = await listen("profile-created", () => {
      const profilesStringified = localStorage.getItem("profiles") || "";
      setProfiles(JSON.parse(profilesStringified));
    });
    setUnlisteners({ unlistenEvent: unlisten });
  };

  return (
    <div className="flex h-full">
      <section className="flex flex-col min-w-[280px] p-4 justify-between">
        <div className="flex flex-col gap-6">
          <Input placeholder="Search by address/name" />
          <div className="flex flex-col gap-2">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                className={cn(
                  "flex items-center justify-between bg-slate-100  px-4 py-2 rounded-xl text-left",
                  activeProfile?.id === profile.id && "bg-primary text-white"
                )}
                onClick={() => setActiveProfile(profile)}
              >
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-sm">{profile.name}</h3>
                  <span className="text-xs">0 ETH</span>
                </div>
                <div className="flex flex-col text-xs text-right gap-1">
                  <span>{truncateEthAddress(profile.address)}</span>
                  <Badge variant="secondary">{profile.network}</Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
        <Button variant="outline" onClick={handleNewProfile}>
          New profile
        </Button>
      </section>
      <Separator orientation="vertical" />
      <main className="w-full">
        <header className="flex justify-between items-center text-slate-100 bg-primary w-full p-4 rounded-b-xl">
          <div>
            <div className="flex gap-2 items-center">
              <h1 className="text-lg">{activeProfile?.name}</h1>
              <span className="text-sm">{activeProfile?.address}</span>
            </div>
            <span className="font-bold">100.0003231 ETH</span>
          </div>
          <div className="flex flex-col text-xs items-end gap-2">
            <Badge variant="outline" className="w-fit text-white">
              {activeProfile?.network}
            </Badge>
            <span>Latest Block: 21999</span>
            <span>17:44:25 14.02.2069</span>
          </div>
        </header>
        <section className="flex p-4">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions">Transactions</TabsContent>
            <TabsContent value="tokens">Tokens</TabsContent>
            <TabsContent value="settings">Settings</TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};
