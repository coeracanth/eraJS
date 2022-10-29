import * as C from "../../parser/const.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import { PrintFlag } from "../../printer.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class Print extends Statement {
  public flags: Set<PrintFlag>;
  public value: Lazy<string>;

  public constructor(flags: PrintFlag[], raw: Slice) {
    super(raw);

    this.flags = new Set(flags);
    this.value = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    if (vm.printer.skipDisp) {
      return null;
    }

    yield* vm.printer.print(this.value.get(), this.flags);

    return null;
  }
}
