import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import { PrintFlag } from "../../printer.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class PrintS extends Statement {
  public flags: Set<PrintFlag>;
  public arg: Lazy<Expr>;

  public constructor(flags: PrintFlag[], raw: Slice) {
    super(raw);

    this.flags = new Set(flags);
    this.arg = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    if (vm.printer.skipDisp) {
      return null;
    }

    const value = await this.arg.get().reduce(vm);
    assert.string(value, "1st argument of PRINTS must be a string");
    yield* vm.printer.print(value, this.flags);

    return null;
  }
}
