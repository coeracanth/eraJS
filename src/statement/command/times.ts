import * as assert from "../../assert.ts";
import * as C from "../../parser/const.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import type VM from "../../vm.ts";
import type Variable from "../expr/variable.ts";
import Statement from "../index.ts";

const PARSER = U.arg2R2(X.variable, C.Float);
export default class Times extends Statement {
  public arg: Lazy<[Variable, number]>;

  public constructor(raw: Slice) {
    super(raw);

    this.arg = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    const [dest, value] = this.arg.get();

    const original = await dest.reduce(vm);
    assert.bigint(original, "1st argument of TIMES must be a number");
    const index = await dest.reduceIndex(vm);

    let result = 0n;
    let remaining = value;
    for (let i = 0; i < 100; ++i) {
      if (remaining === 0) {
        break;
      }
      const high = Math.floor(remaining);
      result += original * BigInt(high) / (100n ** BigInt(i));
      remaining = (remaining - high) * 100;
    }
    dest.getCell(vm).set(vm, result, index);

    return null;
  }
}
