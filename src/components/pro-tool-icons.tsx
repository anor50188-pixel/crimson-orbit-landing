import browserAi from "@/assets/pro-icons/browser-ai.png.asset.json";
import visionAi from "@/assets/pro-icons/vision-ai.png.asset.json";
import codeRunner from "@/assets/pro-icons/code-runner.png.asset.json";
import databaseStudio from "@/assets/pro-icons/database-studio.png.asset.json";
import cloudWorkspace from "@/assets/pro-icons/cloud-workspace.png.asset.json";
import aiStudio from "@/assets/pro-icons/ai-studio.png.asset.json";
import automationHub from "@/assets/pro-icons/automation-hub.png.asset.json";

type IconProps = { className?: string };

const make = (src: string, alt: string) =>
  function ProIcon({ className }: IconProps) {
    return (
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`${className ?? ""} object-contain select-none`}
      />
    );
  };

export const BrowserAiIcon = make(browserAi.url, "Browser AI");
export const VisionAiIcon = make(visionAi.url, "Vision AI");
export const CodeRunnerIcon = make(codeRunner.url, "Code Runner");
export const DatabaseStudioIcon = make(databaseStudio.url, "Database Studio");
export const CloudWorkspaceIcon = make(cloudWorkspace.url, "Cloud Workspace");
export const AiStudioIcon = make(aiStudio.url, "AI Studio");
export const AutomationHubIcon = make(automationHub.url, "Automation Hub");