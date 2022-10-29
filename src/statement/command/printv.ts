import P from "../../../deps/parsimmon.ts";

import * as C from "../../parser/const.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import { PrintFlag } from "../../printer.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Const from "../expr/const.ts";
import Statement from "../index.ts";

const PARSER = U.argNR0(P.alt(
  P.string("'").then(C.charSeq(",").map((str) => new Const(str))),
  X.expr,
));
export default class PrintV extends Statement {
  public flags: Set<PrintFlag>;
  public value: Lazy<Expr[]>;

  public constructor(flags: PrintFlag[], raw: Slice) {
    super(raw);

    this.flags = new Set(flags);
    this.value = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    if (vm.printer.skipDisp) {
      return null;
    }

    let text = "";
    for (const value of this.value.get()) {
      text += (await value.reduce(vm)).toString();
    }
    yield* vm.printer.print(text, this.flags);

    return null;
  }
}
