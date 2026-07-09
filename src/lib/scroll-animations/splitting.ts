type SplitBy = "words" | "chars";

export async function splitElement(el: HTMLElement, by: SplitBy = "chars") {
  if (el.dataset.splittingApplied) return;

  const { default: Splitting } = await import("splitting");
  Splitting({ target: el, by });
  el.dataset.splittingApplied = "true";
}
