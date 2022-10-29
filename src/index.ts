import parseCSV from "./csv/index.ts";
import parseERB from "./parser/erb.ts";
import parseERH from "./parser/erh.ts";
import Define from "./property/define.ts";
import VM from "./vm.ts";

export type { default as Config } from "./config.ts";
export { default as EraJSError } from "./error.ts";
export type {
  ButtonChunk,
  Chunk,
  ClearOutput,
  ContentOutput,
  InputOutput,
  LineOutput,
  Output,
  StringChunk,
  TInputOutput,
  WaitOutput,
} from "./statement/index.ts";
export type { VM };

export function compile(files: Map<string, string>): VM {
  const csvFiles = new Map<string, string>();
  const erhFiles = new Map<string, string>();
  const erbFiles = new Map<string, string>();
  for (const [file, content] of files) {
    const FILE = file.toUpperCase();
    if (FILE.endsWith(".CSV")) {
      csvFiles.set(file.toUpperCase(), content);
    } else if (FILE.endsWith(".ERH")) {
      erhFiles.set(file.toUpperCase(), content);
    } else if (FILE.endsWith(".ERB")) {
      erbFiles.set(file.toUpperCase(), content);
    }
  }

  const csv = parseCSV(csvFiles);

  const macros = new Set<string>();
  const header = parseERH(erhFiles, macros);
  for (const property of header) {
    if (property instanceof Define) {
      macros.add(property.name);
    }
  }
  const fnList = parseERB(erbFiles, macros);

  return new VM({ header, fnList, csv });
}
