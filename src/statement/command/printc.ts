import * as C from "../../parser/const.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import { PrintFlag } from "../../printer.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class PrintC extends Statement {
  public align: "LEFT" | "RIGHT";
  public flags: Set<PrintFlag>;
  public value: Lazy<string>;

  public constructor(align: PrintC["align"], flags: PrintFlag[], raw: Slice) {
    super(raw);

    this.align = align;
    this.flags = new Set(flags);
    this.value = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    if (vm.printer.skipDisp) {
      return null;
    }

    const value = this.value.get();
    yield* vm.printer.print(value, this.flags, this.align);

    return null;
  }
}
