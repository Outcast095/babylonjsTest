// Модуль обработки клавиш WASD — чистая фабрика обработчика
// Зависимости (логирование/реакция) передаются явно через параметр, без побочных эффектов внутри

export type WasdKey = "w" | "a" | "s" | "d";
export type WasdLogger = (key: WasdKey) => void;
export type WasdHandler = (event: KeyboardEvent) => void;

// Чистая функция: создаёт обработчик для keydown и использует переданный logger
export const createWASDKeydownHandler = (logger: WasdLogger): WasdHandler => {
  const ALLOWED: ReadonlySet<WasdKey> = new Set<WasdKey>(["w", "a", "s", "d"]);

  return (event: KeyboardEvent): void => {
    const rawKey: string = event.key.toLowerCase();
    if (ALLOWED.has(rawKey as WasdKey)) {
      logger(rawKey as WasdKey);
    }
  };
};