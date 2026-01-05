import { ParsedRow, ValidationError } from '@/types';
import { indianStates } from '@/data/sampleData';

export function parseCSV(content: string): string[][] {
  const lines = content.trim().split('\n');
  return lines.map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
}

export function validateRow(
  row: string[],
  rowIndex: number,
  headers: string[]
): { parsedRow: ParsedRow; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  let yearValue: number | null = null;
  let stateValue = '';
  let dataValue: number | null = null;

  const yearIdx = headers.findIndex(h => h.toLowerCase().includes('year'));
  const stateIdx = headers.findIndex(h => h.toLowerCase().includes('state'));
  const valueIdx = headers.findIndex(h => h.toLowerCase().includes('value') || h.toLowerCase().includes('rate'));

  // Validate Year
  if (yearIdx >= 0 && row[yearIdx]) {
    const year = parseInt(row[yearIdx], 10);
    if (isNaN(year)) {
      errors.push({
        row: rowIndex,
        column: headers[yearIdx],
        message: 'Invalid year format',
        value: row[yearIdx],
      });
    } else if (year < 1947 || year > 2030) {
      errors.push({
        row: rowIndex,
        column: headers[yearIdx],
        message: 'Year must be between 1947 and 2030',
        value: row[yearIdx],
      });
    } else {
      yearValue = year;
    }
  } else if (yearIdx >= 0) {
    errors.push({
      row: rowIndex,
      column: 'Year',
      message: 'Missing year value',
      value: '',
    });
  }

  // Validate State
  if (stateIdx >= 0 && row[stateIdx]) {
    const state = row[stateIdx].trim();
    if (!indianStates.some(s => s.toLowerCase() === state.toLowerCase())) {
      errors.push({
        row: rowIndex,
        column: headers[stateIdx],
        message: 'Invalid state/territory name',
        value: state,
      });
    } else {
      stateValue = state;
    }
  } else if (stateIdx >= 0) {
    errors.push({
      row: rowIndex,
      column: 'State',
      message: 'Missing state value',
      value: '',
    });
  }

  // Validate Value
  if (valueIdx >= 0 && row[valueIdx]) {
    const value = parseFloat(row[valueIdx]);
    if (isNaN(value)) {
      errors.push({
        row: rowIndex,
        column: headers[valueIdx],
        message: 'Non-numeric value where numeric expected',
        value: row[valueIdx],
      });
    } else if (value < 0) {
      errors.push({
        row: rowIndex,
        column: headers[valueIdx],
        message: 'Value cannot be negative',
        value: row[valueIdx],
      });
    } else {
      dataValue = value;
    }
  } else if (valueIdx >= 0) {
    errors.push({
      row: rowIndex,
      column: 'Value',
      message: 'Missing value',
      value: '',
    });
  }

  return {
    parsedRow: {
      year: yearValue,
      state: stateValue,
      value: dataValue,
      isValid: errors.length === 0,
      errors: errors.map(e => e.message),
    },
    errors,
  };
}

export function parseAndValidateFile(
  content: string
): { rows: ParsedRow[]; errors: ValidationError[]; headers: string[] } {
  const parsed = parseCSV(content);
  
  if (parsed.length < 2) {
    return {
      rows: [],
      errors: [{ row: 0, column: '', message: 'File must have headers and at least one data row', value: '' }],
      headers: [],
    };
  }

  const headers = parsed[0];
  const dataRows = parsed.slice(1);
  const allErrors: ValidationError[] = [];
  const parsedRows: ParsedRow[] = [];

  dataRows.forEach((row, index) => {
    const { parsedRow, errors } = validateRow(row, index + 2, headers);
    parsedRows.push(parsedRow);
    allErrors.push(...errors);
  });

  return { rows: parsedRows, errors: allErrors, headers };
}
