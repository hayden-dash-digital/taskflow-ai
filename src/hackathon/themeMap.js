/* themeMap.js — converts full-key theme (task-manager) → abbreviated-key theme (hackathon) */
export function mapTheme(t) {
  return {
    bg: t.bg,
    side: t.sidebar,
    card: t.card,
    cb: t.cardBorder,
    text: t.text,
    ts: t.textSecondary,
    tm: t.textMuted,
    acc: t.accent,
    al: t.accentLight,
    ib: t.inputBg,
    ibr: t.inputBorder,
    mod: t.modalBg,
    sh: t.shadow,
    shH: t.shadowHover,
    rbg: t.columnBg,
    cbg: t.messageBg || t.inputBg,
    mbg: t.card,
    scr: t.scrollbar,
  };
}
