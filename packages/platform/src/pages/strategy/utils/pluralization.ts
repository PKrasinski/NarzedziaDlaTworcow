/**
 * Polish pluralization utility
 * Handles Polish number-dependent word forms
 */

interface PluralForms {
  one: string;      // 1 cel
  few: string;      // 2-4 cele  
  many: string;     // 5+ celów
}

/**
 * Returns the correct Polish plural form based on the count
 */
export function pluralize(count: number, forms: PluralForms): string {
  if (count === 1) {
    return forms.one;
  }
  
  if (count >= 2 && count <= 4) {
    return forms.few;
  }
  
  return forms.many;
}

/**
 * Predefined plural forms for common entities
 */
export const PLURAL_FORMS = {
  goal: {
    one: "cel",
    few: "cele", 
    many: "celów"
  },
  persona: {
    one: "persona",
    few: "persony",
    many: "person"
  },
  format: {
    one: "format",
    few: "formaty",
    many: "formatów"
  },
  idea: {
    one: "pomysł",
    few: "pomysły", 
    many: "pomysłów"
  }
} as const;

/**
 * Helper function to format count with plural form
 */
export function formatCount(count: number, entityType: keyof typeof PLURAL_FORMS): string {
  const forms = PLURAL_FORMS[entityType];
  const pluralForm = pluralize(count, forms);
  return `${count} ${pluralForm}`;
}