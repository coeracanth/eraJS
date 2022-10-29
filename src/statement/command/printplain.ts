import * as assert from "../../assert.ts";
import * as C from "../../parser/const.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Const from "../expr/const.ts";
import Statement from "../index.ts";

const PARSER_CONST = U.arg1R0(C.charSeq()).map((str) => new Const(str ?? ""));
const PARSER_FORM = U.arg1R0(X.form[""]).map((form) => form ?? new Const(""));
export default class PrintPlain extends Statement {
  public arg: Lazy<Expr>;

  public constructor(postfix: "FORM" | null, raw: Slice) {
    super(raw);

    switch (postfix) {
      case null: {
        this.arg = new Lazy(raw, PARSER_CONST);
        break;
      }
      case "FORM": {
        this.arg = new Lazy(raw, PARSER_FORM);
      }
    }
  }

  public async *run(vm: VM) {
    if (vm.printer.skipDisp) {
      return null;
    }

    const text = await this.arg.get().reduce(vm);
    assert.string(text, "1st argument of PRINTPLAIN must be a string");

    yield* vm.printer.print(text, new Set());

    return null;
  }
}
