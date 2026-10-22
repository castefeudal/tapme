export const cardURL = "https://castefeudal.github.io/tapme/";
const escape = (text: string) =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
export function vcard(phone: string | null = null) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Markov;Pavel;;;",
    "FN:Pavel Markov",
    "URL:" + cardURL,
    "X-SOCIALPROFILE;TYPE=Telegram:https://t.me/markovmade",
    ...(phone?.trim() ? ["TEL;TYPE=CELL:" + escape(phone.trim())] : []),
    "END:VCARD",
    "",
  ].join("\r\n");
}
