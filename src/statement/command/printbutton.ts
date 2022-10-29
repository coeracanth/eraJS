import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg2R2(X.expr, X.expr);
export default class PrintButton extends Statement {
  public align?: "LEFT" | "RIGHT";
  public arg: Lazy<[Expr, Expr]>;

  public constructor(raw: Slice, align?: PrintButton["align"]) {
    super(raw);

    this.align = align;
    this.arg = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    const [textExpr, valueExpr] = this.arg.get();

    const text = await textExpr.reduce(vm);
    assert.string(text, "1st argument of PRINTBUTTON must be a string");
    const value = await valueExpr.reduce(vm);

    yield* vm.printer.button(
      text,
      typeof value === "string" ? value : value.toString(),
      this.align,
    );

    return null;
  }
}
