/**
 * Deep comparison utility to check if two values are equal
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (a == null || b == null) return a === b;
  
  if (typeof a !== typeof b) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => 
      keysB.includes(key) && deepEqual(a[key], b[key])
    );
  }
  
  return false;
}

/**
 * Calculate diff between current and updated objects
 * Returns only fields that have different values
 * For nested objects/arrays, if any nested value differs, the entire object/array is included
 */
export function calculateDiff<T extends Record<string, any>>(
  current: T | null | undefined,
  updated: T
): Partial<T> {
  const diff: Partial<T> = {};
  
  for (const [key, value] of Object.entries(updated)) {
    const currentValue = current?.[key];
    
    if (!deepEqual(currentValue, value)) {
      diff[key as keyof T] = value;
    }
  }
  
  return diff;
}