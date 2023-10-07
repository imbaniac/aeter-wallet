import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HDNodeWallet } from "ethers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

const NETWORKS = [
  {
    name: "Ethereum",
  },
  {
    name: "Polygon",
  },
  {
    name: "Ganache",
  },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Profile name must be at least 2 characters.",
  }),
  network: z.string({
    required_error: "Please select a network",
  }),
  address: z.string({
    required_error: "Please select an address",
  }),
});

type Props = { accounts: HDNodeWallet[] };

export const NewProfile = ({ accounts }: Props) => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      network: NETWORKS[0].name,
      address: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // TODO: should extends existing profiles
    // TODO: rewrite to SQLite
    localStorage.setItem("profiles", JSON.stringify([values]));
    navigate({ to: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <h1 className="text-2xl font-bold">New Profile</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="test" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Network</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NETWORKS.map((network) => (
                        <SelectItem key={network.name} value={network.name}>
                          {network.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => {
              return (
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm">Address</h3>
                  <ul className="flex flex-col gap-2">
                    {accounts.map((account) => (
                      <div
                        key={account.address}
                        className={cn(
                          "bg-slate-200 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer",
                          field.value === account.address && "bg-slate-300"
                        )}
                        onClick={() => field.onChange(account.address)}
                      >
                        {account.address}
                      </div>
                    ))}
                  </ul>
                </div>
              );
            }}
          />
          <Button className="w-full" size="lg" type="submit">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};
