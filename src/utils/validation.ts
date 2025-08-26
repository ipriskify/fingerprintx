import { TelemetryPayload } from "../types";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateDataStructure(
  data: any,
  expectedFields: string[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== "object") {
    errors.push("Data must be a valid object");
    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  for (const field of expectedFields) {
    if (data[field] === undefined || data[field] === null) {
      warnings.push(`Missing field: ${field}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validatePayload(payload: TelemetryPayload): ValidationResult {
  const requiredFields = ["collectorId", "timestamp", "data"];
  return validateDataStructure(payload, requiredFields);
}
