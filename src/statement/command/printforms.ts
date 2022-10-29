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
export default class PrintFormS extends Statement {
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

    const form = await this.arg.get().reduce(vm);
    assert.string(form, "1st argument of PRINTFORMS must be a string");
    const text = await X.form[""].tryParse(form).reduce(vm);
    assert.string(
      text,
      "1st argument of PRINTFORMS must be reduced to a string",
    );
    yield* vm.printer.print(text, this.flags);

    return null;
  }
}
