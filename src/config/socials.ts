import {
  faTelegram,
  faWhatsapp,
  faGithub,
  faInstagram,
  faTiktok,
  faYoutube,
  faLinkedinIn,
  faVk,
  faThreads,
  faXTwitter,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";
import { profile } from "./profile";
export const socials = [
  { name: "Telegram", url: profile.telegram, icon: faTelegram },
  { name: "WhatsApp", url: profile.whatsapp, icon: faWhatsapp },
  ...Object.entries(profile.socials).map(([name, url]) => ({
    name,
    url,
    icon: {
      GitHub: faGithub,
      Instagram: faInstagram,
      TikTok: faTiktok,
      YouTube: faYoutube,
      LinkedIn: faLinkedinIn,
      VK: faVk,
      Threads: faThreads,
      X: faXTwitter,
      Facebook: faFacebookF,
    }[name]!,
  })),
  { name: "Telegram Bot", url: profile.bot, icon: faTelegram },
];
export function activeSocial(url: string) {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}
