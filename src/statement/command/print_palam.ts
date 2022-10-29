import * as assert from "../../assert.ts";
import * as X from "../../parser/expr.ts";
import * as U from "../../parser/util.ts";
import Lazy from "../../lazy.ts";
import Slice from "../../slice.ts";
import Int1DValue from "../../value/int-1d.ts";
import IntChar1DValue from "../../value/int-char-1d.ts";
import type VM from "../../vm.ts";
import type Expr from "../expr/index.ts";
import Statement from "../index.ts";

const PARSER = U.arg1R1(X.expr);
export default class PrintPalam extends Statement {
  public arg: Lazy<Expr>;

  public constructor(raw: Slice) {
    super(raw);

    this.arg = new Lazy(raw, PARSER);
  }

  public async *run(vm: VM) {
    if (vm.printer.skipDisp) {
      return null;
    }

    const index = await this.arg.get().reduce(vm);
    assert.bigint(index, "1st argument of PRINT_PALAM must be a number");

    const palamName = vm.getValue("PALAMNAME");
    const validName: string[] = [];
    for (let i = 0; i < palamName.length(0); ++i) {
      const name = palamName.get(vm, [i]) as string;
      if (name !== "") {
        validName.push(name);
      }
    }

    for (let i = 0; i < validName.length; ++i) {
      const name = validName[i];
      const value = vm.getValue<IntChar1DValue>("PALAM").get(vm, [
        Number(index),
        i,
      ]);
      const palamLv = [
        vm.getValue<Int1DValue>("PALAMLV").get(vm, [0]),
        vm.getValue<Int1DValue>("PALAMLV").get(vm, [1]),
        vm.getValue<Int1DValue>("PALAMLV").get(vm, [2]),
        vm.getValue<Int1DValue>("PALAMLV").get(vm, [3]),
        vm.getValue<Int1DValue>("PALAMLV").get(vm, [4]),
      ];

      let text = name;
      if (value >= palamLv[4]) {
        text += "[" + "*".repeat(10) + "]";
      } else if (value >= palamLv[3]) {
        const filled = Number(10n * value / palamLv[4]);
        text += "[" + "*".repeat(filled) + ".".repeat(10 - filled) + "]";
      } else if (value >= palamLv[2]) {
        const filled = Number(10n * value / palamLv[3]);
        text += "[" + ">".repeat(filled) + ".".repeat(10 - filled) + "]";
      } else if (value >= palamLv[1]) {
        const filled = Number(10n * value / palamLv[2]);
        text += "[" + "=".repeat(filled) + ".".repeat(10 - filled) + "]";
      } else {
        const filled = Number(10n * value / palamLv[1]);
        text += "[" + "-".repeat(filled) + ".".repeat(10 - filled) + "]";
      }

      text += value.toString();

      yield* vm.printer.print(text, new Set(), "LEFT");
      if ((i + 1) % vm.printCPerLine === 0) {
        yield* vm.printer.newline();
      }
    }
    yield* vm.printer.newline();

    return null;
  }
}
