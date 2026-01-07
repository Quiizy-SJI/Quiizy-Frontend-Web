import * as XLSX from 'xlsx';

export type ExcelJsonRow = Record<string, unknown>;

function normalizeHeader(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function downloadXlsx(filename: string, rows: ExcelJsonRow[], sheetName = 'Sheet1'): void {
  const safeFilename = filename.toLowerCase().endsWith('.xlsx') ? filename : `${filename}.xlsx`;

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([arrayBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFilename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function readExcelFile(file: File): Promise<ExcelJsonRow[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) return [];

  // Use first row as headers
  const rows = XLSX.utils.sheet_to_json<ExcelJsonRow>(worksheet, { defval: '' });

  // Normalize headers (case-insensitive handling) by rewriting keys
  return rows.map((r) => {
    const normalized: ExcelJsonRow = {};
    for (const [key, value] of Object.entries(r)) {
      normalized[normalizeHeader(key)] = value;
    }
    return normalized;
  });
}

export function getCell(row: ExcelJsonRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[normalizeHeader(k)];
    const s = String(v ?? '').trim();
    if (s) return s;
  }
  return '';
}

export function getCellNumber(row: ExcelJsonRow, ...keys: string[]): number {
  const v = getCell(row, ...keys);
  if (!v) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
