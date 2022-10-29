import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Form from "../expr/form.ts";
import Statement, { EraGenerator } from "../index.ts";

const PARSER = U.arg1R0(X.form[""]);
export default class ReuseLastLine extends Statement {
  public arg: Lazy<Form | undefined>;

  public constructor(raw: Slice) {
    super(raw);

    this.arg = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM): EraGenerator {
    const value = await this.arg.get()?.reduce(vm) ?? "";
    assert.string(value, "Argument of REUSELASTLINE must be a string");

    yield* vm.printer.print(value, new Set(["S"]));
    vm.printer.isLineTemp = true;

    return null;
  }
}
