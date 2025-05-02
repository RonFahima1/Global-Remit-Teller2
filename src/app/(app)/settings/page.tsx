import { Metadata } from "next";
import { SSOSettings } from "@/components/settings/sso-settings";
import { ThemeSettings } from "@/components/settings/theme-settings";

export const metadata: Metadata = {
  title: "Settings - Global Remit",
  description: "Manage your application settings",
};

export default function SettingsPage() {
  return (
    <div className="w-full px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and configurations
        </p>
      </div>

      <div className="grid gap-6">
        <ThemeSettings />
        <SSOSettings />
      </div>
    </div>
  );
}
