import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class ClearLine extends Statement {
  public arg: Lazy<Expr>;

  public constructor(raw: Slice) {
    super(raw);

    this.arg = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    const count = await this.arg.get().reduce(vm);
    assert.bigint(count, "Argument of CLEARLINE must be an integer!");

    yield* vm.printer.clear(Number(count));

    return null;
  }
}
