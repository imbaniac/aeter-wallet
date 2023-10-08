import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

import { Badge } from "@/components/ui/badge";
import { cn, truncateEthAddress } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col w-[280px] p-4 justify-between">
        <div className="flex flex-col gap-6">
          <Input placeholder="Search by address/name" />
          <div className="flex flex-col gap-2">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                className={cn(
                  "flex items-center justify-between bg-slate-200 px-4 py-2 rounded-xl text-left",
                  activeProfile?.id === profile.id && "bg-slate-300"
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
        <Button onClick={handleNewProfile}>New profile</Button>
      </div>
      <Separator orientation="vertical" />
    </div>
  );
};
